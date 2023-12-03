import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Spot } from 'src/app/core/models/spot.model';
import { StarComponent } from 'src/app/shared/components/stars.component';

@Component({
  selector: 'show-spot-detail',
  template: ` @if (spot) {
    <div class="cs-show-spot-detail" [@detailSpotAnimation]>
      <div class="cs-show-spot-detail--topBar">
        <div class="cs-show-spot-detail--topBar__title">
          Szczegóły o tym miejscu
        </div>
        <button mat-icon-button color="primary" (click)="close()">
          <mat-icon fontIcon="close"></mat-icon>
        </button>
      </div>
      <div class="cs-show-spot-detail--content">
        <div class="cs-show-spot-detail--content__address">
          ul. {{ this.spot.address.streetName }}
          {{ this.spot.address.houseNumber }}{{ genRestOfAddress() }}
        </div>
        <div class="cs-show-spot-detail--content__shortContent">
          {{ this.spot.opinion.shortContent }}
        </div>
        <div class="cs-show-spot-detail--content__content">
          {{ this.spot.opinion.content }}
        </div>
        <div class="cs-show-spot-detail--content__starTitle">Internet</div>
        <cs-stars
          [editable]="false"
          [selection]="this.spot.opinion.internetRating"
        ></cs-stars>
        <div class="cs-show-spot-detail--content__starTitle">Komunikacja</div>
        <cs-stars
          [editable]="false"
          [selection]="this.spot.opinion.communicationRating"
        ></cs-stars>
        <div class="cs-show-spot-detail--content__starTitle">Sąsiedztwo</div>
        <cs-stars
          [editable]="false"
          [selection]="this.spot.opinion.neighborRating"
        ></cs-stars>
        <div class="cs-show-spot-detail--content__starTitle">Okolica</div>
        <cs-stars
          [editable]="false"
          [selection]="this.spot.opinion.neighborhoodRating"
        ></cs-stars>
        <div class="cs-show-spot-detail--content__metadata">
          przesłane {{ this.spot.issuedDate | date : 'dd.MM.yyyy' }} przez
          {{ this.spot.issuedBy.name }}
        </div>
      </div>
    </div>
    }`,
  standalone: true,
  animations: [
    trigger('detailSpotAnimation', [
      transition(':enter', [
        style({ scale: 0.5, opacity: 0 }),
        animate(150, style({ scale: 1, opacity: 1 })),
      ]),
      transition(':leave', [
        style({ scale: 1, opacity: 1 }),
        animate(150, style({ scale: 0.5, opacity: 0 })),
      ]),
    ]),
  ],
  imports: [CommonModule, MatIconModule, MatButtonModule, StarComponent],
})
export class ShowSpotDetailComponent implements OnInit {
  @Input() spot: Spot | undefined;
  constructor() {}

  ngOnInit() {}
  public close(): void {
    this.spot = undefined;
  }
  public genRestOfAddress(): string {
    if (!this.spot?.address.apartmentNumber) {
      return '';
    } else if (this.spot.address.floor === undefined) {
      return `/${this.spot.address.apartmentNumber}`;
    }
    return `/${this.spot.address.apartmentNumber} piętro: ${this.spot.address.floor}`;
  }
}
