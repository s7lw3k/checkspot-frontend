import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StarComponent } from 'src/app/shared/components/stars.component';

@Component({
  selector: 'cs-new-spot-section',
  template: `
    <div class="cs-new-spot-section">
      <div class="cs-new-spot-section--title">{{ title }}</div>
      <div class="cs-new-spot-section--content">
        {{ content }}
      </div>
      <cs-stars
        [selection]="rating"
        (selectionChange)="handleChange($event)"
        [size]="32"
      ></cs-stars>
    </div>
  `,
  standalone: true,
  imports: [StarComponent, CommonModule],
})
export class NewSpotSectionComponent {
  @Input() title: string;
  @Input() content: string;
  @Input() rating: number;
  @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>();

  public handleChange(newVal: number) {
    this.rating = newVal;
    this.ratingChange.emit(this.rating);
  }
}
