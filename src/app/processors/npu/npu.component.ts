import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationControlService } from '../../simulation-control.service';

@Component({
  selector: 'app-npu',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block w-full h-full' },
  template: `
    <canvas #canvasRef class="w-full h-full block"></canvas>
  `,
})
export class NpuComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  isPlaying = true;
  triggerReset = 0;

  private animationRef: number | null = null;
  private subscriptions: any[] = [];
  private simState = {
    time: 0,
    particles: [] as any[],
    nodes: [] as any[],
    connections: [] as any[],
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
    state.nodes = [];
    state.connections = [];

    // Neural Network Layers: 4 -> 6 -> 6 -> 3
    const layers = [4, 6, 6, 3];
    const layerSpacing = 120;
    const nodeSpacing = 50;
    const startX = width / 2 - (layers.length * layerSpacing) / 2 + 60;

    layers.forEach((nodeCount, layerIndex) => {
      const startY = height / 2 - (nodeCount * nodeSpacing) / 2 + 25;
      for(let i=0; i<nodeCount; i++) {
        state.nodes.push({
          id: `${layerIndex}-${i}`,
          layer: layerIndex,
          x: startX + layerIndex * layerSpacing,
          y: startY + i * nodeSpacing,
          activation: 0
        });
      }
    });

    // Connections
    for(let l=0; l<layers.length-1; l++) {
      const currentLayerNodes = state.nodes.filter((n: any) => n.layer === l);
      const nextLayerNodes = state.nodes.filter((n: any) => n.layer === l+1);
      currentLayerNodes.forEach((n1: any) => {
        nextLayerNodes.forEach((n2: any) => {
          state.connections.push({
            n1, n2, weight: Math.random() * 0.8 + 0.2, active: 0
          });
        });
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

      this.updateAndDrawNPU(ctx, canvas.width, canvas.height, this.simState);

      this.animationRef = requestAnimationFrame(loop);
    };

    loop();
  }

  private updateAndDrawNPU(ctx: CanvasRenderingContext2D, width: number, height: number, state: any) {
    // Pulse data through network
    if (state.time % 100 === 0) {
      // Fire input nodes
      state.nodes.filter((n: any) => n.layer === 0).forEach((n: any) => {
        n.activation = 1;
        state.particles.push({
          source: n, layer: 0, progress: 0
        });
      });
    }

    // Draw Connections
    state.connections.forEach((conn: any) => {
      conn.active *= 0.9;
      ctx.beginPath();
      ctx.moveTo(conn.n1.x, conn.n1.y);
      ctx.lineTo(conn.n2.x, conn.n2.y);
      ctx.strokeStyle = `rgba(168, 85, 247, ${0.1 + conn.active * 0.5})`; // Purple
      ctx.lineWidth = 1 + conn.weight * 2;
      ctx.stroke();
    });

    // Update Particles (Pulses)
    let newParticles: any[] = [];
    for (let i = state.particles.length - 1; i >= 0; i--) {
      let p = state.particles[i];
      p.progress += 0.02; // speed

      // Find connections from source
      let conns = state.connections.filter((c: any) => c.n1 === p.source);

      conns.forEach((conn: any) => {
        // Only trigger strong connections
        if (conn.weight > 0.4) {
          conn.active = Math.max(conn.active, Math.sin(p.progress * Math.PI));

          // Draw pulse moving along line
          let px = conn.n1.x + (conn.n2.x - conn.n1.x) * p.progress;
          let py = conn.n1.y + (conn.n2.y - conn.n1.y) * p.progress;

          ctx.fillStyle = '#d8b4fe'; // Light purple
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI*2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Reached next node
          if (p.progress >= 1 && p.progress < 1.05) {
            conn.n2.activation = Math.min(1, conn.n2.activation + conn.weight * 0.5);
            // Fire next layer if enough activation
            if (conn.n2.activation > 0.8 && conn.n2.layer < 3) {
               newParticles.push({source: conn.n2, layer: conn.n2.layer, progress: 0});
               conn.n2.activation = 0; // reset
            }
          }
        }
      });

      if (p.progress >= 1) {
        state.particles.splice(i, 1);
      }
    }
    state.particles.push(...newParticles);

    // Draw Nodes
    state.nodes.forEach((node: any) => {
      node.activation *= 0.95; // decay
      ctx.beginPath();
      ctx.arc(node.x, node.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();

      // Activation fill
      ctx.beginPath();
      ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 85, 247, ${0.2 + node.activation * 0.8})`;
      ctx.fill();

      ctx.strokeStyle = '#7e22ce';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Final output labels
      if (node.layer === 3) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        let label = node.id === '3-0' ? 'Perro' : node.id === '3-1' ? 'Gato' : 'Pájaro';
        ctx.fillText(label, node.x + 20, node.y + 4);
      }
    });
  }
}
