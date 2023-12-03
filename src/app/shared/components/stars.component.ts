import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'cs-stars',
  template: `
    <div class="cs-stars">
      @for (number of numbers; track $index) {
      <div
        class="cs-stars--star"
        [ngStyle]="{ cursor: editable ? 'pointer' : '' }"
      >
        @if(number * 2 - selection < 1) {
        <mat-icon [style]="{ 'font-size': size + 'px' }">star</mat-icon>
        } @else if (number * 2 - selection === 1) {
        <mat-icon
          (click)="selectStars(number)"
          [style]="{ 'font-size': size + 'px' }"
          >star_half</mat-icon
        >
        } @else {
        <mat-icon
          (click)="selectStars(number)"
          [style]="{ 'font-size': size + 'px' }"
          >star_outline</mat-icon
        >
        }
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
      }
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
