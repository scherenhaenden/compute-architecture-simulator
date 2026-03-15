import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationControlService } from '../../simulation-control.service';

@Component({
  selector: 'app-qpu',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block w-full h-full' },
  template: `
    <canvas #canvasRef class="w-full h-full block"></canvas>
  `,
})
export class QpuComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  isPlaying = true;
  triggerReset = 0;

  private animationRef: number | null = null;
  private subscriptions: any[] = [];
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

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 80;

    // 5 Qubits en un círculo
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
      state.grid.push({
        id: i,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        baseAngle: angle,
        collapsed: null
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

      this.updateAndDrawQPU(ctx, canvas.width, canvas.height, this.simState);

      this.animationRef = requestAnimationFrame(loop);
    };

    loop();
  }

  private updateAndDrawQPU(ctx: CanvasRenderingContext2D, width: number, height: number, state: any) {
    const cycle = state.time % 300;
    const centerX = width / 2;
    const centerY = height / 2;

    // Ondas de microondas (Interferencia/Puertas) durante la superposición
    if (cycle < 150) {
      if (state.time % 20 === 0) {
         state.waves.push({ radius: 0, maxRadius: 150 });
      }
    }

    // Actualizar y dibujar ondas
    ctx.lineWidth = 2;
    for (let i = state.waves.length - 1; i >= 0; i--) {
       let w = state.waves[i];
       w.radius += 2;
       ctx.strokeStyle = `rgba(6, 182, 212, ${1 - w.radius/w.maxRadius})`;
       ctx.beginPath();
       ctx.arc(centerX, centerY, w.radius, 0, Math.PI*2);
       ctx.stroke();
       if (w.radius >= w.maxRadius) state.waves.splice(i, 1);
    }

    // Dibujar líneas de Entrelazamiento
    if (cycle > 100 && cycle < 250) {
       ctx.strokeStyle = `rgba(236, 72, 153, ${(cycle - 100)/50})`;
       if (cycle > 200) ctx.strokeStyle = `rgba(236, 72, 153, ${(250 - cycle)/50})`;
       ctx.lineWidth = 3;
       ctx.beginPath();
       for(let i=0; i<state.grid.length; i++) {
          for(let j=i+1; j<state.grid.length; j++) {
             ctx.moveTo(state.grid[i].x, state.grid[i].y);
             ctx.lineTo(state.grid[j].x, state.grid[j].y);
          }
       }
       ctx.stroke();
    }

    // Dibujar Qubits
    state.grid.forEach((qubit: any) => {
       let color, glow;
       let size = 20;

       if (cycle === 250) {
          // ¡Colapso!
          qubit.collapsed = Math.random() > 0.5 ? 1 : 0;
       }

       if (cycle >= 250 && cycle < 290) {
          // Estado colapsado (0 o 1)
          color = qubit.collapsed === 1 ? '#ec4899' : '#06b6d4';
          glow = color;
       } else {
          // Estado de superposición (temblando)
          qubit.collapsed = null;
          let wobble = Math.sin(state.time * 0.1 + qubit.baseAngle) * 5;
          size += wobble;
          let mix = (Math.sin(state.time * 0.05 + qubit.id) + 1) / 2;
          let r = Math.floor(6 + mix * (236 - 6));
          let g = Math.floor(182 - mix * (182 - 72));
          let b = Math.floor(212 - mix * (212 - 153));
          color = `rgb(${r}, ${g}, ${b})`;
          glow = color;
       }

       ctx.fillStyle = color;
       ctx.shadowColor = glow;
       ctx.shadowBlur = 20;
       ctx.beginPath();
       ctx.arc(qubit.x, qubit.y, size, 0, Math.PI * 2);
       ctx.fill();

       ctx.fillStyle = '#fff';
       ctx.shadowBlur = 0;
       ctx.beginPath();
       ctx.arc(qubit.x, qubit.y, size * 0.4, 0, Math.PI * 2);
       ctx.fill();

       if (qubit.collapsed !== null) {
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 16px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(qubit.collapsed, qubit.x, qubit.y + size + 20);
       }
    });

    // Texto de estado
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    let status = "Superposición";
    if (cycle > 100 && cycle < 250) status = "Entrelazamiento Cuántico";
    if (cycle >= 250 && cycle < 290) status = "Colapso (Medición)";
    ctx.fillText(status, centerX, centerY + 140);
  }
}
