import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationControlService } from '../../simulation-control.service';

@Component({
  selector: 'app-lpu',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block w-full h-full' },
  template: `
    <canvas #canvasRef class="w-full h-full block"></canvas>
  `,
})
export class LpuComponent implements AfterViewInit, OnDestroy {
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

    // Tubería (Pipeline) de SRAM/Compute súper rápida (5 etapas)
    const numStages = 5;
    const stageWidth = 80;
    const stageHeight = 180;
    const spacing = 40;
    const startX = width / 2 - (numStages * stageWidth + (numStages - 1) * spacing) / 2;
    const startY = height / 2 - stageHeight / 2;

    for(let i = 0; i < numStages; i++) {
      state.grid.push({
        x: startX + i * (stageWidth + spacing),
        y: startY,
        w: stageWidth,
        h: stageHeight,
        flash: 0,
        label: i === 0 ? 'Entrada' : i === numStages - 1 ? 'Salida' : 'SRAM+MAC'
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

      this.updateAndDrawLPU(ctx, canvas.width, canvas.height, this.simState);

      this.animationRef = requestAnimationFrame(loop);
    };

    loop();
  }

  private updateAndDrawLPU(ctx: CanvasRenderingContext2D, width: number, height: number, state: any) {
    // Generar "tokens" a muy alta velocidad y en línea recta (flujo secuencial rápido)
    if (state.time % 6 === 0) { // Frecuencia de generación ultrarrápida
      const chars = ['T', 'O', 'K', 'E', 'N', 'A', 'I', 'L', 'L', 'M'];
      const randomChar = chars[Math.floor(Math.random() * chars.length)];

      state.particles.push({
        x: -50,
        y: height / 2 + (Math.random() - 0.5) * 60, // Flujo centralizado
        speed: 12 + Math.random() * 2, // Velocidad extrema
        char: randomChar
      });
    }

    // Dibujar etapas del Pipeline de la LPU
    state.grid.forEach((stage: any) => {
      stage.flash *= 0.85; // Se desvanece rápidamente
      ctx.fillStyle = stage.flash > 0.1 ? `rgba(249, 115, 22, ${stage.flash})` : '#1e293b'; // Naranja
      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 2;
      ctx.fillRect(stage.x, stage.y, stage.w, stage.h);
      ctx.strokeRect(stage.x, stage.y, stage.w, stage.h);

      // Líneas internas (representando SRAM de alta densidad)
      ctx.fillStyle = '#334155';
      for(let i = 0; i < 6; i++) {
        ctx.fillRect(stage.x + 10, stage.y + 25 + i * 25, stage.w - 20, 12);
      }

      // Etiqueta de la etapa
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(stage.label, stage.x + stage.w / 2, stage.y - 10);
    });

    // Actualizar y dibujar los Tokens de lenguaje
    for (let i = state.particles.length - 1; i >= 0; i--) {
      let p = state.particles[i];
      p.x += p.speed; // Movimiento determinista estricto hacia adelante

      // Colisión/Procesamiento ultrarrápido con las etapas
      state.grid.forEach((stage: any) => {
        if (Math.abs(p.x - (stage.x + stage.w / 2)) < p.speed) {
           stage.flash = 1; // Destello de procesamiento
        }
      });

      // Dibujar el Token
      ctx.fillStyle = '#fed7aa'; // Naranja muy claro
      ctx.shadowColor = '#ea580c'; // Resplandor naranja
      ctx.shadowBlur = 15;

      ctx.beginPath();
      // Forma de pequeño rectángulo simulando un paquete de datos/palabra
      ctx.roundRect(p.x - 10, p.y - 10, 20, 20, 4);
      ctx.fill();

      // Letra del token
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#9a3412';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.char, p.x, p.y);

      // Eliminar si sale de la pantalla
      if (p.x > width + 50) state.particles.splice(i, 1);
    }
  }
}
