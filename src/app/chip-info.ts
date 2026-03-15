import { Cpu, Grid, Maximize, BrainCircuit, Network, Atom, MessageSquare } from 'lucide-angular';

export interface ChipInfo {
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
