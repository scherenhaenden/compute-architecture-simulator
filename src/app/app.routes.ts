import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'cpu', pathMatch: 'full' },
  { path: 'cpu', loadComponent: () => import('./processors/cpu/cpu.component').then(m => m.CpuComponent) },
  { path: 'gpu', loadComponent: () => import('./processors/gpu/gpu.component').then(m => m.GpuComponent) },
  { path: 'tpu', loadComponent: () => import('./processors/tpu/tpu.component').then(m => m.TpuComponent) },
  { path: 'npu', loadComponent: () => import('./processors/npu/npu.component').then(m => m.NpuComponent) },
  { path: 'dpu', loadComponent: () => import('./processors/dpu/dpu.component').then(m => m.DpuComponent) },
  { path: 'qpu', loadComponent: () => import('./processors/qpu/qpu.component').then(m => m.QpuComponent) },
  { path: 'lpu', loadComponent: () => import('./processors/lpu/lpu.component').then(m => m.LpuComponent) },
];
