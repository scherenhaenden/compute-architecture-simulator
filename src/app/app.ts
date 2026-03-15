import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { LucideAngularModule, Play, Pause, RotateCcw, Info } from 'lucide-angular';
import { CHIP_INFO, ChipInfo } from './chip-info';
import { filter } from 'rxjs/operators';
import { SimulationControlService } from './simulation-control.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './app.html',
})
export class App {
  readonly CHIP_INFO = CHIP_INFO;
  readonly chipKeys = ['CPU', 'GPU', 'TPU', 'NPU']; // Only using the 4 main chips

  activeChip = 'CPU';

  readonly icons = {
    Play, Pause, RotateCcw, Info
  };

  constructor(
    private router: Router,
    public simControl: SimulationControlService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const path = event.urlAfterRedirects.split('/')[1];
      if (path) {
        this.activeChip = path.toUpperCase();
      }
    });
  }

  togglePlaying() {
    this.simControl.togglePlaying();
  }

  resetSimulation() {
    this.simControl.triggerReset();
  }

  get activeInfo(): ChipInfo {
    return this.CHIP_INFO[this.activeChip] || this.CHIP_INFO['CPU'];
  }
}
