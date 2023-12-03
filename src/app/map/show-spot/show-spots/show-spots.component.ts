import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { SimpleSpot } from 'src/app/core/models/spot.model';
import { StarComponent } from 'src/app/shared/components/stars.component';

@Component({
  selector: 'cs-show-spots',
  template: ` <div class="cs-show-spots">
    @for (spot of spots; track $index) {
    <div class="cs-show-spots--spot" (click)="handleSelect(spot)">
      <div class="cs-show-spots--content">{{ spot.opinion }}</div>
      <div class="cs-show-spots--date">
        {{ spot.address.streetName }} {{ spot.address.houseNumber
        }}{{ this.genRestOfAddress(spot) }}
      </div>
      <div class="cs-show-spots--date">
        {{ spot.issuedDate | date : 'dd.MM.yyyy' }}
      </div>
      <cs-stars [editable]="false" [selection]="spot.rating"
        >id: {{ spot.id }}</cs-stars
      >
    </div>
    } @empty { Brak spotów do sprawdzenia }
  </div>`,
  standalone: true,
  imports: [CommonModule, StarComponent],
})
export class ShowSpotsComponent implements OnInit, OnDestroy {
  spots: SimpleSpot[] = [];
  @Output() selectedSpot = new EventEmitter<SimpleSpot>();
  constructor() {}

  ngOnInit() {}
  ngOnDestroy(): void {}

  public handleSelect(spot: SimpleSpot): void {
    this.selectedSpot.emit(spot);
  }
  public genRestOfAddress(spot: SimpleSpot): string {
    if (spot.address.apartmentNumber === undefined) {
      return '';
    } else if (spot.address.floor === undefined) {
      return `/${spot.address.apartmentNumber}`;
    }
    return `/${spot.address.apartmentNumber} piętro: ${spot.address.floor}`;
  }
}
