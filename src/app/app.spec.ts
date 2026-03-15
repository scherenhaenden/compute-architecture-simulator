import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { LucideAngularModule, Cpu, Grid, Maximize, BrainCircuit, Play, Pause, RotateCcw, Info, Network, Atom, MessageSquare } from 'lucide-angular';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        LucideAngularModule.pick({
          Cpu, Grid, Maximize, BrainCircuit, Play, Pause, RotateCcw, Info, Network, Atom, MessageSquare
        })
      ],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with CPU active', () => {
    expect(component.activeChip).toEqual('CPU');
  });

  it('should initialize with isPlaying true from service', () => {
    expect(component.simControl.isPlaying).toBe(true);
  });

  it('should toggle playing state via service', () => {
    component.togglePlaying();
    expect(component.simControl.isPlaying).toBe(false);
    component.togglePlaying();
    expect(component.simControl.isPlaying).toBe(true);
  });

  it('should have chipKeys with CPU, GPU, TPU, NPU', () => {
    expect(component.chipKeys).toEqual(['CPU', 'GPU', 'TPU', 'NPU']);
  });
});