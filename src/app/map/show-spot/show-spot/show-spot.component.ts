import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SimpleSpot } from 'src/app/core/models/spot.model';
import { StarComponent } from 'src/app/shared/components/stars.component';

@Component({
  selector: 'show-component',
  template: ` <div class="cs-show-spot">
    <h1 class="cs-show-spot--title">{{ spot.opinion }}</h1>
    <cs-stars [editable]="false" [selection]="spot.rating" [size]="30">{{
      spot.rating
    }}</cs-stars>
    <div class="cs-show-spot--address">
      ul.{{ spot.address.streetName }} {{ spot.address.houseNumber }}
      {{ genRestOfAddress() }}
    </div>
    <div class="cs-show-spots--date">
      {{ spot.issuedDate | date : 'dd.MM.yyyy' }}
    </div>
    <button mat-button class="cs-show-spot--button" (click)="handleDetails()">
      Pokaż szczegóły
    </button>
  </div>`,
  standalone: true,
  imports: [StarComponent, MatButtonModule, DatePipe],
})
export class ShowSpotComponent {
  @Input() spot: SimpleSpot;
  @Output() selectedSpot = new EventEmitter<SimpleSpot>();
  constructor() {}

  public genRestOfAddress(): string {
    if (!this.spot.address.apartmentNumber) {
      return '';
    } else if (this.spot.address.floor === undefined) {
      return `/${this.spot.address.apartmentNumber}`;
    }
    return `/${this.spot.address.apartmentNumber} piętro: ${this.spot.address.floor}`;
  }

  public handleDetails(): void {
    this.selectedSpot.emit(this.spot);
  }
}
