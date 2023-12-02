import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Opinion } from 'src/app/core/models/opinion.model';
import { Spot } from 'src/app/core/models/spot.model';
import { StarComponent } from 'src/app/shared/components/stars.component';

@Component({
  selector: 'show-component',
  template: ` <div class="cs-show-spot">
    <h1 class="cs-show-spot--title">{{ spot.opinion.shortContent }}</h1>
    <cs-stars [editable]="false" [selection]="averageRate" [size]="30">{{
      spot.opinion.content
    }}</cs-stars>
    <div class="cs-show-spot--address">
      ul.{{ spot.address.streetName }} {{ spot.address.houseNumber }}
      {{ genRestOfAddress() }}
    </div>
    <button mat-button class="cs-show-spot--button" (click)="handleDetails()">
      Pokaż szczegóły
    </button>
  </div>`,
  standalone: true,
  imports: [StarComponent, MatButtonModule],
})
export class ShowSpotComponent implements OnInit {
  @Input() spot: Spot;
  @Output() selectedSpot = new EventEmitter<Spot>();

  averageRate: number = 0;
  constructor() {}

  ngOnInit() {
    this.averageRate = this.getAverageRate(this.spot.opinion);
  }

  private getAverageRate(opinion: Opinion): number {
    return Math.floor(
      (opinion.internetRating +
        opinion.neighborRating +
        opinion.neighborhoodRating +
        opinion.communicationRating) /
        4
    );
  }

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
