import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Opinion } from 'src/app/core/models/opinion.model';
import { Spot } from 'src/app/core/models/spot.model';
import { StarComponent } from 'src/app/shared/components/stars.component';

@Component({
  selector: 'cs-show-spots',
  template: ` <div class="cs-show-spots">
    <div
      *ngFor="let spot of spots"
      class="cs-show-spots--spot"
      (click)="handleSelect(spot)"
    >
      <div class="cs-show-spots--content">{{ spot.opinion.shortContent }}</div>
      <div class="cs-show-spots--date">
        {{ spot.issuedDate | date : 'dd.MM.yyyy' }}
      </div>
      <cs-stars [editable]="false" [selection]="getAverageRate(spot.opinion)"
        >id: {{ spot.id }}</cs-stars
      >
    </div>
  </div>`,
  standalone: true,
  imports: [CommonModule, StarComponent],
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

  public getAverageRate(opinion: Opinion): number {
    return Math.floor(
      (opinion.internetRating +
        opinion.neighborRating +
        opinion.neighborhoodRating +
        opinion.communicationRating) /
        4
    );
  }
}
