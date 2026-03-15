# Future Implementation Plan: Silicon Simulator Enhancements

This document outlines the planned next steps to enhance the Silicon Simulator interactive web application.

## 1. Add "Real" (Small) Operations
Currently, the visualization only displays simulated particles moving based on random timers. The goal is to bind these animations to real, albeit small, mathematical or logical operations.

**Implementation Steps:**
- **CPU:** Implement a small sequence of real instructions (e.g., fetch, decode, execute for a simple addition or branching logic). Provide a visible accumulator showing real intermediate values.
- **GPU:** Implement a real matrix addition or multiplication on a very small dataset (e.g., 4x4 matrix). Show the data values moving through the SIMD lanes.
- **TPU:** Implement a micro-systolic array calculation. Feed actual weights and activation values into the grid and show the real multiply-accumulate (MAC) result emerging at the end.
- **NPU:** Implement a tiny perceptron or a 1-layer neural network with fixed weights that evaluates a real boolean logic gate (like XOR or AND) to "classify" an input.

## 2. WebAssembly (Wasm) Integration
To demonstrate performance and bring the simulation closer to "bare metal", we will port the core simulation calculations from JavaScript to WebAssembly.

**Implementation Steps:**
- **Language Selection:** Choose Rust or C++ (e.g., using `wasm-bindgen` for Rust or Emscripten for C++) to compile our core loop logic into Wasm.
- **Offload Heavy Lifting:** Move the coordinate updating, collision detection, and array state management from the Angular TypeScript components to the Wasm module.
- **Angular Integration:** Load the `.wasm` file asynchronously in our Angular services. Pass the canvas context or an array buffer back and forth so the Angular view layer only handles rendering the final calculated states.
- **Performance Toggle:** Add a UI toggle to let users switch between the JavaScript simulation engine and the WebAssembly simulation engine, highlighting the performance differences.