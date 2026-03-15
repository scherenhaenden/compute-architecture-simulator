import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationControlService } from '../../simulation-control.service';

@Component({
  selector: 'app-cpu',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block w-full h-full' },
  template: `
    <canvas #canvasRef class="w-full h-full block"></canvas>
  `,
})
export class CpuComponent implements AfterViewInit, OnDestroy {
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

    // 4 Large Cores
    const coreWidth = 120;
    const coreHeight = 120;
    const spacing = 40;
    const startX = width / 2 - coreWidth - spacing / 2;
    const startY = height / 2 - coreHeight - spacing / 2;

    for(let i=0; i<4; i++) {
      state.grid.push({
        x: startX + (i%2) * (coreWidth + spacing),
        y: startY + Math.floor(i/2) * (coreHeight + spacing),
        w: coreWidth,
        h: coreHeight,
        busyTimer: 0
      });
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

      this.updateAndDrawCPU(ctx, canvas.width, canvas.height, this.simState);

      this.animationRef = requestAnimationFrame(loop);
    };

    loop();
  }

  private updateAndDrawCPU(ctx: CanvasRenderingContext2D, width: number, height: number, state: any) {
    // Spawn tasks
    if (state.time % 40 === 0) {
      const targetCore = state.grid[Math.floor(Math.random() * state.grid.length)];
      if (targetCore.busyTimer <= 0) {
        state.particles.push({
          x: width / 2, y: -20,
          targetX: targetCore.x + targetCore.w/2,
          targetY: targetCore.y + targetCore.h/2,
          core: targetCore,
          phase: 'enter',
          color: `hsl(${Math.random()*360}, 80%, 60%)`,
          workTime: Math.random() * 100 + 50
        });
        targetCore.busyTimer = 1; // Mark as receiving
      }
    }

    // Draw Cores
    state.grid.forEach((core: any) => {
      ctx.strokeStyle = core.busyTimer > 1 ? '#60a5fa' : '#334155';
      ctx.lineWidth = 4;
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(core.x, core.y, core.w, core.h, 12);
      ctx.fill();
      ctx.stroke();

      // Core internals (ALU logic lines)
      ctx.strokeStyle = core.busyTimer > 1 ? '#3b82f6' : '#0f172a';
      ctx.lineWidth = 2;
      for(let i=1; i<4; i++) {
        ctx.beginPath();
        ctx.moveTo(core.x + 20, core.y + i*30);
        ctx.lineTo(core.x + core.w - 20, core.y + i*30);
        ctx.stroke();
      }
    });

    // Update & Draw Particles (Tasks)
    for (let i = state.particles.length - 1; i >= 0; i--) {
      let p = state.particles[i];

      if (p.phase === 'enter') {
        p.y += (p.targetY - p.y) * 0.1;
        p.x += (p.targetX - p.x) * 0.1;
        if (Math.abs(p.y - p.targetY) < 2) {
          p.phase = 'work';
          p.core.busyTimer = p.workTime;
        }
      } else if (p.phase === 'work') {
        p.core.busyTimer--;
        // Jiggle around to simulate complex work
        p.x = p.targetX + (Math.random() - 0.5) * 40;
        p.y = p.targetY + (Math.random() - 0.5) * 40;
        if (p.core.busyTimer <= 0) {
          p.phase = 'exit';
        }
      } else if (p.phase === 'exit') {
        p.y += 5;
        // smooth return to center X
        p.x += (width/2 - p.x) * 0.05;
        if (p.y > height + 20) state.particles.splice(i, 1);
      }

      // Draw particle
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.phase === 'work' ? 8 : 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
}
