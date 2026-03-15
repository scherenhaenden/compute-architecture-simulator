import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  it('should initialize with isPlaying true', () => {
    expect(component.isPlaying).toBe(true);
  });

  it('should toggle playing state', () => {
    component.togglePlaying();
    expect(component.isPlaying).toBe(false);
    component.togglePlaying();
    expect(component.isPlaying).toBe(true);
  });

  it('should set active chip correctly', () => {
    component.setActiveChip('GPU');
    expect(component.activeChip).toEqual('GPU');
  });
});