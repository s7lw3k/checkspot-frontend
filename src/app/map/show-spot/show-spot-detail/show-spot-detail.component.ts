import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Spot } from 'src/app/core/models/spot.model';

@Component({
  selector: 'show-spot-detail',
  template: ` <div
    *ngIf="spot"
    class="cs-show-spot-detail"
    [@detailSpotAnimation]
  >
    <div class="cs-new-spot--topBar">
      <div class="cs-new-spot--topBar__title">Szyguły o tym miejscu</div>
      <button mat-icon-button color="primary" (click)="close()">
        <mat-icon fontIcon="close"></mat-icon>
      </button>
    </div>
    {{ spot.id }}
  </div>`,
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
  imports: [CommonModule, MatIconModule, MatButtonModule],
})
export class ShowSpotDetailComponent implements OnInit {
  @Input() spot: Spot | undefined;
  constructor() {}

  ngOnInit() {}
  public close(): void {
    this.spot = undefined;
  }
}
