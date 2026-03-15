import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Cpu, Grid, Maximize, BrainCircuit, Play, Pause, RotateCcw, Info, Network, Atom, MessageSquare } from 'lucide-angular';

interface ChipInfo {
  title: string;
  subtitle: string;
  icon: any; // Using lucide-angular component reference
  color: string;
  bg: string;
  border: string;
  kidFriendly: string;
  technical: string;
  metaphor: string;
}

export const CHIP_INFO: Record<string, ChipInfo> = {
  CPU: {
    title: 'CPU (Unidad Central de Procesamiento)',
    subtitle: 'El Gestor Inteligente',
    icon: Cpu,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500',
    kidFriendly: 'Imagina a unos pocos profesores súper inteligentes. Pueden resolver rompecabezas increíblemente complejos, pero normalmente de uno en uno. ¡La CPU es el jefe del ordenador y le dice a los demás qué hacer!',
    technical: 'Optimizada para el procesamiento secuencial y en serie. Cuenta con unos pocos núcleos potentes con lógica de control compleja, cachés grandes y está diseñada para manejar ramificaciones impredecibles (if/else) a gran velocidad.',
    metaphor: '4 chefs expertos cocinando menús complejos de varios platos.'
  },
  GPU: {
    title: 'GPU (Unidad de Procesamiento Gráfico)',
    subtitle: 'El Ejército de Trabajadores',
    icon: Grid,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500',
    kidFriendly: 'Imagina a miles de diminutos trabajadores con pinceles. Cada uno solo puede pintar un punto, pero todos pintan AL MISMO TIEMPO para terminar un mural gigante al instante. ¡Perfecto para videojuegos en 3D!',
    technical: 'Optimizada para el procesamiento paralelo. Cuenta con miles de ALU (Unidades Lógico Aritméticas) más simples y pequeñas diseñadas para realizar la misma operación matemática en grandes bloques de datos simultáneamente (SIMD).',
    metaphor: '1000 empleados de comida rápida preparando hamburguesas al mismo tiempo.'
  },
  TPU: {
    title: 'TPU (Unidad de Procesamiento Tensorial)',
    subtitle: 'La Línea de Ensamblaje Matemático',
    icon: Maximize,
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    border: 'border-amber-500',
    kidFriendly: 'Imagina una cinta transportadora gigante en una fábrica. Los números fluyen y se combinan sin detenerse nunca a guardarse en una caja. ¡Hace las matemáticas masivas para la Inteligencia Artificial súper rápido!',
    technical: 'Cuenta con un "Arreglo Sistólico". En lugar de leer/escribir en memoria para cada cálculo, los datos fluyen a través de una cuadrícula de Multiplicadores-Acumuladores (MAC) en una ola continua, acelerando dramáticamente la multiplicación de matrices.',
    metaphor: 'Una cadena humana pasando baldes de agua perfectamente sincronizada.'
  },
  NPU: {
    title: 'NPU (Unidad de Procesamiento Neuronal)',
    subtitle: 'El Cerebro Digital',
    icon: BrainCircuit,
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
    border: 'border-purple-500',
    kidFriendly: 'Construido como un pequeño cerebro digital con "neuronas". Cuando mira la foto de un perro, las señales viajan a través de caminos en forma de red. Si los caminos correctos se iluminan, el ordenador grita: "¡Es un perro!"',
    technical: 'Un circuito especializado que implementa toda la lógica de control y aritmética necesaria para ejecutar algoritmos de aprendizaje automático, operando típicamente en modelos predictivos como redes neuronales artificiales.',
    metaphor: 'Un juego del teléfono descompuesto donde el mensaje final identifica un objeto.'
  },
  DPU: {
    title: 'DPU (Unidad de Procesamiento de Datos)',
    subtitle: 'El Policía de Tráfico',
    icon: Network,
    color: 'text-sky-400',
    bg: 'bg-sky-500/20',
    border: 'border-sky-500',
    kidFriendly: 'Imagina un centro de clasificación de correo súper rápido. En lugar de que el jefe (la CPU) tenga que abrir y redirigir cada paquete, ¡la DPU clasifica todos los datos a la velocidad del rayo y los envía directamente a donde se necesitan!',
    technical: 'Un procesador de datos especializado (a menudo un SmartNIC) que descarga tareas de red, almacenamiento y seguridad de la CPU anfitriona. Enruta los flujos de datos de forma altamente paralela y libera el sistema principal.',
    metaphor: 'Un cruce de autopistas inteligente que dirige el tráfico directamente a su destino sin atascos.'
  },
  QPU: {
    title: 'QPU (Unidad de Procesamiento Cuántico)',
    subtitle: 'El Multiverso de los Datos',
    icon: Atom,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500',
    kidFriendly: 'Imagina un laberinto mágico. En lugar de probar un camino a la vez para encontrar la salida, te multiplicas y exploras TODOS los caminos al mismo tiempo. ¡Así es como una computadora cuántica resuelve ciertos rompecabezas casi al instante!',
    technical: 'Utiliza cúbits (qubits) que pueden existir en múltiples estados simultáneamente (superposición) e interactuar a distancia (entrelazamiento). Excelente para criptografía, simulación molecular y problemas complejos de optimización.',
    metaphor: 'Buscar un libro en una biblioteca leyendo todos los libros al mismo tiempo.'
  },
  LPU: {
    title: 'LPU (Unidad de Procesamiento de Lenguaje)',
    subtitle: 'El Generador de Palabras Ultrarrápido',
    icon: MessageSquare,
    color: 'text-orange-400',
    bg: 'bg-orange-500/20',
    border: 'border-orange-500',
    kidFriendly: 'Imagina una cinta transportadora mágica para palabras. En lugar de detenerse a pensar en cada letra, las palabras enteras vuelan a través de un túnel a la velocidad de la luz. ¡Es el motor perfecto para hablar con IAs rapidísimo!',
    technical: 'Diseñada específicamente para Modelos de Lenguaje Grande (LLMs). Supera los cuellos de botella del ancho de banda de memoria al tener cantidades masivas de SRAM en el mismo chip, procesando tokens de forma secuencial, determinista y con latencia ultrabaja.',
    metaphor: 'Un tren bala de alta velocidad entregando vagones de palabras sin detenerse nunca.'
  }
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './app.html',
})
export class App implements AfterViewInit, OnDestroy {
  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  readonly CHIP_INFO = CHIP_INFO;
  readonly chipKeys = Object.keys(CHIP_INFO);

  activeChip = 'CPU';
  isPlaying = true;

  // Make icons available to template
  readonly icons = {
    Cpu, Grid, Maximize, BrainCircuit, Play, Pause, RotateCcw, Info, Network, Atom, MessageSquare
  };

  private animationRef: number | null = null;
  private simState = {
    time: 0,
    particles: [] as any[],
    grid: [] as any[],
    nodes: [] as any | Record<string, any>,
    connections: [] as any[],
    waves: [] as any[]
  };

  ngAfterViewInit() {
    this.resizeCanvas();
    this.startLoop();
  }

  ngOnDestroy() {
    if (this.animationRef !== null) {
      cancelAnimationFrame(this.animationRef);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
  }

  setActiveChip(chip: string) {
    this.activeChip = chip;
    this.resetSimulation();
  }

  togglePlaying() {
    this.isPlaying = !this.isPlaying;
  }

  get activeInfo() {
    return this.CHIP_INFO[this.activeChip];
  }

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      this.initSimulation(this.activeChip, canvas.width, canvas.height);
    }
  }

  resetSimulation() {
    const canvas = this.canvasRef.nativeElement;
    this.initSimulation(this.activeChip, canvas.width, canvas.height);
  }

  private initSimulation(chipType: string, width: number, height: number) {
    const state = this.simState;
    state.time = 0;
    state.particles = [];
    state.grid = [];
    state.nodes = [];
    state.connections = [];
    state.waves = [];

    if (chipType === 'CPU') {
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
    } else if (chipType === 'GPU') {
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
    } else if (chipType === 'TPU') {
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
    } else if (chipType === 'NPU') {
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
    } else if (chipType === 'DPU') {
      const centerX = width / 2;
      const centerY = height / 2;

      state.nodes = {
        network: { x: centerX, y: centerY - 150, label: 'Red' },
        dpu: { x: centerX, y: centerY, w: 120, h: 80, label: 'DPU' },
        storage: { x: centerX - 120, y: centerY + 120, label: 'Almacenamiento' },
        cpu: { x: centerX + 120, y: centerY + 120, label: 'Host CPU' }
      };
    } else if (chipType === 'QPU') {
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
    } else if (chipType === 'LPU') {
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

      if (this.activeChip === 'CPU') this.updateAndDrawCPU(ctx, canvas.width, canvas.height, this.simState);
      if (this.activeChip === 'GPU') this.updateAndDrawGPU(ctx, canvas.width, canvas.height, this.simState);
      if (this.activeChip === 'TPU') this.updateAndDrawTPU(ctx, canvas.width, canvas.height, this.simState);
      if (this.activeChip === 'NPU') this.updateAndDrawNPU(ctx, canvas.width, canvas.height, this.simState);
      if (this.activeChip === 'DPU') this.updateAndDrawDPU(ctx, canvas.width, canvas.height, this.simState);
      if (this.activeChip === 'QPU') this.updateAndDrawQPU(ctx, canvas.width, canvas.height, this.simState);
      if (this.activeChip === 'LPU') this.updateAndDrawLPU(ctx, canvas.width, canvas.height, this.simState);

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
