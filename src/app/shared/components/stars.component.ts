import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'cs-stars',
  template: `
    <div class="cs-stars">
      <div class="cs-stars--star" *ngFor="let number of numbers">
        <mat-icon *ngIf="number * 2 - selection < 1">star</mat-icon>
        <mat-icon
          *ngIf="number * 2 - selection === 1"
          (click)="selectStars(number)"
          >star_half</mat-icon
        >
        <mat-icon
          *ngIf="number * 2 - selection > 1"
          (click)="selectStars(number)"
          >star_outline</mat-icon
        >
        <div
          class="cs-stars--selectL"
          (click)="selectStars(number * 2 - 1)"
        ></div>
        <div class="cs-stars--selectR" (click)="selectStars(number * 2)"></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, MatIconModule],
})
export class StarComponent implements OnInit {
  @Input() numOfStars: number = 5;
  @Input() selection: number = 0;
  @Output() selectionChange: EventEmitter<number> = new EventEmitter<number>();
  numbers = new Array();
  constructor() {}

  ngOnInit() {
    this.numbers = Array(this.numOfStars)
      .fill(0)
      .map((x, i) => i + 1);
  }
  public selectStars(selected: number): void {
    this.selection = selected;
    this.selectionChange.emit(this.selection);
  }
}
