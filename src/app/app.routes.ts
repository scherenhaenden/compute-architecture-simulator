import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'cpu', pathMatch: 'full' },
  { path: 'cpu', loadComponent: () => import('./processors/cpu/cpu.component').then(m => m.CpuComponent) },
  { path: 'gpu', loadComponent: () => import('./processors/gpu/gpu.component').then(m => m.GpuComponent) },
  { path: 'tpu', loadComponent: () => import('./processors/tpu/tpu.component').then(m => m.TpuComponent) },
  { path: 'npu', loadComponent: () => import('./processors/npu/npu.component').then(m => m.NpuComponent) },
];
