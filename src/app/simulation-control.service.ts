import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimulationControlService {
  private isPlayingSubject = new BehaviorSubject<boolean>(true);
  isPlaying$ = this.isPlayingSubject.asObservable();

  private resetSubject = new BehaviorSubject<number>(0);
  reset$ = this.resetSubject.asObservable();

  togglePlaying() {
    this.isPlayingSubject.next(!this.isPlayingSubject.value);
  }

  setPlaying(playing: boolean) {
    this.isPlayingSubject.next(playing);
  }

  get isPlaying() {
    return this.isPlayingSubject.value;
  }

  triggerReset() {
    this.resetSubject.next(this.resetSubject.value + 1);
  }
}
