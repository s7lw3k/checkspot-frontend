import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Spot } from 'src/app/core/models/spot.model';

@Component({
  selector: 'cs-show-spots',
  template: ` <div class="cs-show-spots">
    <div
      *ngFor="let spot of spots"
      class="cs-show-spots--spot"
      (click)="handleSelect(spot)"
    >
      <p>name: {{ spot.name }}</p>
      <p>id: {{ spot.id }}</p>
    </div>
  </div>`,
  standalone: true,
  imports: [CommonModule],
})
export class ShowSpotsComponent implements OnInit, OnDestroy {
  spots: Spot[] = [];
  @Output() selectedSpot = new EventEmitter<Spot>();
  constructor() {}

  ngOnInit() {}
  ngOnDestroy(): void {}

  public handleSelect(spot: Spot): void {
    this.selectedSpot.emit(spot);
  }
}
