import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationControlService } from '../../simulation-control.service';

@Component({
  selector: 'app-dpu',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block w-full h-full' },
  template: `
    <canvas #canvasRef class="w-full h-full block"></canvas>
  `,
})
export class DpuComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  isPlaying = true;
  triggerReset = 0;

  private animationRef: number | null = null;
  private subscriptions: any[] = [];
  private simState = {
    time: 0,
    particles: [] as any[],
    nodes: {} as any,
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
    state.nodes = {};

    const centerX = width / 2;
    const centerY = height / 2;

    state.nodes = {
      network: { x: centerX, y: centerY - 150, label: 'Red' },
      dpu: { x: centerX, y: centerY, w: 120, h: 80, label: 'DPU' },
      storage: { x: centerX - 120, y: centerY + 120, label: 'Almacenamiento' },
      cpu: { x: centerX + 120, y: centerY + 120, label: 'Host CPU' }
    };
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

      this.updateAndDrawDPU(ctx, canvas.width, canvas.height, this.simState);

      this.animationRef = requestAnimationFrame(loop);
    };

    loop();
  }

  private updateAndDrawDPU(ctx: CanvasRenderingContext2D, width: number, height: number, state: any) {
    const { network, dpu, storage, cpu } = state.nodes;

    // Pakete spawnen
    if (state.time % 35 === 0) {
      const type = Math.random() > 0.5 ? 'storage' : 'cpu';
      state.particles.push({
        x: network.x, y: network.y,
        targetX: dpu.x, targetY: dpu.y,
        destination: type,
        phase: 'to_dpu',
        color: type === 'storage' ? '#f43f5e' : '#3b82f6', // Rosa vs Blau
        timer: 0
      });
    }

    // Verbindungen zeichnen
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(network.x, network.y); ctx.lineTo(dpu.x, dpu.y);
    ctx.moveTo(dpu.x, dpu.y); ctx.lineTo(storage.x, storage.y);
    ctx.moveTo(dpu.x, dpu.y); ctx.lineTo(cpu.x, cpu.y);
    ctx.stroke();

    // DPU zeichnen
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#0ea5e9'; // Hellblau
    ctx.lineWidth = 3;
    ctx.fillRect(dpu.x - dpu.w/2, dpu.y - dpu.h/2, dpu.w, dpu.h);
    ctx.strokeRect(dpu.x - dpu.w/2, dpu.y - dpu.h/2, dpu.w, dpu.h);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DPU', dpu.x, dpu.y + 6);

    // Endpunkte zeichnen
    ctx.textAlign = 'center';
    const drawEndpoint = (node: any, color: string) => {
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, Math.PI*2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText(node.label, node.x, node.y + 45);
    }

    drawEndpoint(network, '#94a3b8');
    drawEndpoint(storage, '#f43f5e');
    drawEndpoint(cpu, '#3b82f6');

    // Partikel (Datenpakete) aktualisieren & zeichnen
    for (let i = state.particles.length - 1; i >= 0; i--) {
      let p = state.particles[i];

      if (p.phase === 'to_dpu') {
        p.x += (dpu.x - p.x) * 0.1;
        p.y += (dpu.y - p.y) * 0.1;
        if (Math.abs(p.y - dpu.y) < 5) {
           p.phase = 'inspecting';
           p.timer = 15; // Prüfzeit
        }
      } else if (p.phase === 'inspecting') {
        p.timer--;
        // Kurzes Wackeln zur Simulation der Prüfung
        p.x = dpu.x + (Math.random()-0.5)*12;
        p.y = dpu.y + (Math.random()-0.5)*12;
        if (p.timer <= 0) {
           p.phase = 'to_dest';
           p.targetX = p.destination === 'storage' ? storage.x : cpu.x;
           p.targetY = p.destination === 'storage' ? storage.y : cpu.y;
        }
      } else if (p.phase === 'to_dest') {
        p.x += (p.targetX - p.x) * 0.1;
        p.y += (p.targetY - p.y) * 0.1;
        if (Math.abs(p.y - p.targetY) < 5) {
           state.particles.splice(i, 1);
           continue;
        }
      }

      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
}
