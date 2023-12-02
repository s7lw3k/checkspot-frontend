import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'cs-stars',
  template: `
    <div class="cs-stars">
      <div
        class="cs-stars--star"
        *ngFor="let number of numbers"
        [ngStyle]="{ cursor: editable ? 'pointer' : '' }"
      >
        <mat-icon
          *ngIf="number * 2 - selection < 1"
          [style]="{ 'font-size': size + 'px' }"
          >star</mat-icon
        >
        <mat-icon
          *ngIf="number * 2 - selection === 1"
          (click)="selectStars(number)"
          [style]="{ 'font-size': size + 'px' }"
          >star_half</mat-icon
        >
        <mat-icon
          *ngIf="number * 2 - selection > 1"
          (click)="selectStars(number)"
          [style]="{ 'font-size': size + 'px' }"
          >star_outline</mat-icon
        >
        <div
          class="cs-stars--selectL"
          (click)="selectStars(number * 2 - 1)"
          [style]="{ width: size / 2 + 'px', height: size + 'px' }"
        ></div>
        <div
          class="cs-stars--selectR"
          (click)="selectStars(number * 2)"
          [style]="{
            width: size / 2 + 'px',
            height: size + 'px',
            left: size / 2 + 'px'
          }"
        ></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, MatIconModule],
})
export class StarComponent implements OnInit {
  @Input() numOfStars: number = 5;
  @Input() selection: number = 0;
  @Input() size: number = 24;
  @Input() editable: boolean = true;
  @Output() selectionChange: EventEmitter<number> = new EventEmitter<number>();
  numbers = new Array();
  constructor() {}

  ngOnInit() {
    this.numbers = Array(this.numOfStars)
      .fill(0)
      .map((x, i) => i + 1);
  }
  public selectStars(selected: number): void {
    if (this.editable) {
      this.selection = selected;
      this.selectionChange.emit(this.selection);
    }
  }
}
