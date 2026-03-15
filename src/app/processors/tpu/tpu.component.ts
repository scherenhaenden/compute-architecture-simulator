import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationControlService } from '../../simulation-control.service';

@Component({
  selector: 'app-tpu',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block w-full h-full' },
  template: `
    <canvas #canvasRef class="w-full h-full block"></canvas>
  `,
})
export class TpuComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  isPlaying = true;
  triggerReset = 0;

  private animationRef: number | null = null;
  private subscriptions: any[] = [];
  private simState = {
    time: 0,
    particles: [] as any[],
    grid: [] as any[],
  };

  constructor(private simControl: SimulationControlService) {}

  ngAfterViewInit() {
    this.subscriptions.push(
      this.simControl.isPlaying$.subscribe((playing: boolean) => {
        this.isPlaying = playing;
      })
    );

    this.subscriptions.push(
      this.simControl.reset$.subscribe((val: number) => {
        if (val > 0 && this.canvasRef) {
          this.resetSimulation();
        }
      })
    );

    this.resizeCanvas();
    this.startLoop();
  }

  ngOnDestroy() {
    if (this.animationRef !== null) {
      cancelAnimationFrame(this.animationRef);
    }
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
  }

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      this.initSimulation(canvas.width, canvas.height);
    }
  }

  resetSimulation() {
    const canvas = this.canvasRef.nativeElement;
    this.initSimulation(canvas.width, canvas.height);
  }

  private initSimulation(width: number, height: number) {
    const state = this.simState;
    state.time = 0;
    state.particles = [];
    state.grid = [];

    // 6x6 Systolic Array
    const size = 6;
    const cellSize = 40;
    const spacing = 10;
    const startX = width / 2 - (size * (cellSize + spacing)) / 2;
    const startY = height / 2 - (size * (cellSize + spacing)) / 2;

    for(let r=0; r<size; r++) {
      for(let c=0; c<size; c++) {
        state.grid.push({
          r, c,
          x: startX + c * (cellSize + spacing),
          y: startY + r * (cellSize + spacing),
          w: cellSize, h: cellSize,
          flash: 0
        });
      }
    }
  }

  private startLoop() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const loop = () => {
      if (this.isPlaying) {
        this.simState.time++;
      }

      // Clear background
      ctx.fillStyle = '#0f172a'; // slate-950
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      this.updateAndDrawTPU(ctx, canvas.width, canvas.height, this.simState);

      this.animationRef = requestAnimationFrame(loop);
    };

    loop();
  }

  private updateAndDrawTPU(ctx: CanvasRenderingContext2D, width: number, height: number, state: any) {
    const cellSize = 40;
    const spacing = 10;
    const stepSize = cellSize + spacing;
    const tickInterval = 30; // Frames per step

    // Spawn weights (top to bottom) and inputs (left to right)
    if (state.time % tickInterval === 0) {
      // Inputs from Left
      for(let r=0; r<6; r++) {
        if(Math.random() > 0.2) {
          state.particles.push({
             type: 'input', r, c: -1 - r, // offset to create diagonal wave
             x: width/2 - (6 * stepSize)/2 - (r+1)*stepSize,
             y: height/2 - (6 * stepSize)/2 + r*stepSize + cellSize/2,
             targetX: 0, targetY: 0,
             color: '#60a5fa' // Blue
          });
        }
      }
      // Weights from Top
      for(let c=0; c<6; c++) {
        if(Math.random() > 0.2) {
           state.particles.push({
             type: 'weight', r: -1 - c, c, // offset
             x: width/2 - (6 * stepSize)/2 + c*stepSize + cellSize/2,
             y: height/2 - (6 * stepSize)/2 - (c+1)*stepSize,
             targetX: 0, targetY: 0,
             color: '#fbbf24' // Yellow
          });
        }
      }
    }

    // Draw Grid (MACs)
    state.grid.forEach((cell: any) => {
      cell.flash *= 0.85; // Fade out
      ctx.fillStyle = cell.flash > 0.1 ? `rgba(251, 146, 60, ${cell.flash})` : '#1e293b';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
      ctx.strokeRect(cell.x, cell.y, cell.w, cell.h);

      // Draw accumulator value (visual only)
      if (cell.flash > 0.1) {
        ctx.fillStyle = '#fff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('+', cell.x + cell.w/2, cell.y + cell.h/2 + 3);
      }
    });

    // Update Particles
    let toRemove: number[] = [];
    state.particles.forEach((p: any, i: number) => {
      // Calculate target based on current step
      let stepIndex = Math.floor(state.time / tickInterval);
      let localStep = (state.time % tickInterval) / tickInterval; // 0.0 to 1.0

      if (p.type === 'input') {
        let currentC = p.c + stepIndex;
        let nextC = currentC + 1;
        let startX = width/2 - (6 * stepSize)/2 + currentC * stepSize + cellSize/2;
        let endX = width/2 - (6 * stepSize)/2 + nextC * stepSize + cellSize/2;
        p.x = startX + (endX - startX) * localStep;

        if (nextC > 6) toRemove.push(i);

      } else { // weight
        let currentR = p.r + stepIndex;
        let nextR = currentR + 1;
        let startY = height/2 - (6 * stepSize)/2 + currentR * stepSize + cellSize/2;
        let endY = height/2 - (6 * stepSize)/2 + nextR * stepSize + cellSize/2;
        p.y = startY + (endY - startY) * localStep;

        if (nextR > 6) toRemove.push(i);
      }

      // Check for MAC (Multiply Accumulate) flash
      // When localStep is roughly 0.5, they are in the center of a cell
      if (localStep > 0.4 && localStep < 0.6) {
        let activeR = p.type === 'weight' ? p.r + stepIndex : p.r;
        let activeC = p.type === 'input' ? p.c + stepIndex : p.c;

        if (activeR >= 0 && activeR < 6 && activeC >= 0 && activeC < 6) {
           let cell = state.grid.find((c: any) => c.r === activeR && c.c === activeC);
           if (cell) cell.flash = 1;
        }
      }

      // Draw particle
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Clean up
    for(let i = toRemove.length -1; i >= 0; i--) {
      state.particles.splice(toRemove[i], 1);
    }
  }
}
