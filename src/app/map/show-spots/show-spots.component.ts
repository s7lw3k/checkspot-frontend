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
  template: ` <h1>Markery w środku</h1>
    <div class="cs-marker-popup">
      <div
        *ngFor="let spot of spots"
        class="cs-marker-popup--spot"
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
