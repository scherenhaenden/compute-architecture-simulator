import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationControlService } from '../../simulation-control.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gpu',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block w-full h-full' },
  template: `
    <canvas #canvasRef class="w-full h-full block"></canvas>
  `,
})
export class GpuComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  private isPlaying = true;


  private animationRef: number | null = null;
  private subscriptions: Subscription[] = [];
  private simState = {
    time: 0,
    waves: [] as any[],
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
    state.waves = [];
    state.grid = [];

    // 16x8 Grid of tiny cores
    const cols = 16;
    const rows = 8;
    const size = 20;
    const spacing = 8;
    const startX = width / 2 - (cols * (size + spacing)) / 2;
    const startY = height / 2 - (rows * (size + spacing)) / 2 + 40;

    for(let r=0; r<rows; r++) {
      for(let c=0; c<cols; c++) {
        state.grid.push({
          x: startX + c * (size + spacing),
          y: startY + r * (size + spacing),
          w: size,
          h: size,
          active: 0
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

      this.updateAndDrawGPU(ctx, canvas.width, canvas.height, this.simState);

      this.animationRef = requestAnimationFrame(loop);
    };

    loop();
  }

  private updateAndDrawGPU(ctx: CanvasRenderingContext2D, width: number, height: number, state: any) {
    // Spawn waves of simple data
    if (state.time % 60 === 0) {
      state.waves.push({ y: -50, color: `hsl(${Math.random()*60 + 140}, 80%, 50%)` }); // Greenish waves
    }

    // Draw Cores
    state.grid.forEach((core: any) => {
      core.active *= 0.8; // fade out
      ctx.fillStyle = core.active > 0.1 ? `rgba(52, 211, 153, ${core.active})` : '#1e293b';
      ctx.strokeStyle = '#064e3b';
      ctx.lineWidth = 1;
      ctx.fillRect(core.x, core.y, core.w, core.h);
      ctx.strokeRect(core.x, core.y, core.w, core.h);
    });

    // Update & Draw Waves
    ctx.globalCompositeOperation = 'lighter';
    for (let i = state.waves.length - 1; i >= 0; i--) {
      let w = state.waves[i];
      w.y += 4; // Constant fast speed down

      // Check collision with grid
      state.grid.forEach((core: any) => {
        if (Math.abs(w.y - (core.y + core.h/2)) < 5) {
          core.active = 1; // Flash the core as data passes over
        }
      });

      // Draw wave as a wide beam of particles
      ctx.fillStyle = w.color;
      for(let x=0; x<16; x++) {
         ctx.beginPath();
         // Align particles with columns
         let px = (width / 2 - (16 * 28) / 2) + x * 28 + 10;
         ctx.arc(px, w.y, 4, 0, Math.PI * 2);
         ctx.fill();
      }

      if (w.y > height + 50) state.waves.splice(i, 1);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
}
