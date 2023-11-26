import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { LatLng } from 'leaflet';
import { Spot } from 'src/app/core/models/spot.model';
import { AppState } from 'src/app/core/store/app.state';
import { AddSpot } from 'src/app/core/store/spot/spot.action';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { StarComponent } from 'src/app/shared/components/stars.component';
import { NewSpotSectionComponent } from './new-spot-section/new-spot-section.component';
import { Opinion } from 'src/app/core/models/opinion.model';

// const admin: User = {
//   id: 1,
//   name: 'admin',
//   mail: 'admin@admin',
//   password: 'a',
//   createdDate: new Date(),
//   darkMode: false,
// };
@Component({
  selector: 'new-spot',
  template: `
    <div class="cs-new-spot" *ngIf="visible" [@newSpotAnimation]>
      <div class="cs-new-spot--topBar">
        <div class="cs-new-spot--topBar__title">
          Dodaj opinie o tym miejscu!
        </div>
        <button mat-icon-button color="primary" (click)="close()">
          <mat-icon fontIcon="close"></mat-icon>
        </button>
      </div>
      <div>
        <form [formGroup]="formGroup">
          <mat-form-field appearance="outline">
            <mat-label>name</mat-label>
            <input matInput formControlName="name" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>des</mat-label>
            <input matInput formControlName="des" />
          </mat-form-field>
        </form>
        <cs-new-spot-section
          [title]="'Internet'"
          [content]="'Twoja opinia o internecie w tej okolicy:'"
          [(rating)]="opinion.internetRating"
        />
        <cs-new-spot-section
          [title]="'Okolica'"
          [content]="'Twoja opinia o okolicy w tej okolicy:'"
          [(rating)]="opinion.neighborhoodRating"
        />
        <cs-new-spot-section
          [title]="'Sąsiedzi'"
          [content]="'Twoja opinia o sąsiedztwie w tej okolicy:'"
          [(rating)]="opinion.neighborRating"
        />
        <cs-new-spot-section
          [title]="'Komunikacja'"
          [content]="'Twoja opinia o komunikacji w tej okolicy:'"
          [(rating)]="opinion.communicationRating"
        />
      </div>
      <div class="cs-new-spot--bottomBar">
        <button mat-raised-button color="primary" (click)="submit()">
          Dodaj punkt
        </button>
        <button mat-flat-button color="worm" (click)="unSpot()">Anuluj</button>
      </div>
    </div>
  `,
  standalone: true,
  animations: [
    trigger('newSpotAnimation', [
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
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    CommonModule,
    NewSpotSectionComponent,
  ],
})
export class NewSpotComponent {
  @Input() newCords: LatLng;
  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() submitNewSpot: EventEmitter<unknown> = new EventEmitter<unknown>();

  opinion: Opinion = {
    id: 0,
    issuedDate: new Date(),
    photos: [],
    content: '',
    internetRating: 0,
    neighborhoodRating: 0,
    neighborRating: 0,
    communicationRating: 0,
  };

  nameCtrl: FormControl = new FormControl('');
  desCtrl: FormControl = new FormControl('');

  formGroup: FormGroup = new FormGroup({
    name: this.nameCtrl,
    des: this.desCtrl,
  });
  constructor(private store: Store<AppState>) {}

  public submit() {
    const newSpot: Spot = {
      id: Math.floor(Math.random() * 10000),
      name: this.nameCtrl.value,
      des: this.desCtrl.value,
      coordinates: this.newCords,
      opinion: this.opinion,
    };
    this.store.dispatch(new AddSpot({ spot: newSpot }));
    this.desCtrl.setValue('');
    this.nameCtrl.setValue('');
    this.unSpot();
  }

  public unSpot(): void {
    this.submitNewSpot.emit();
    this.opinion = {
      id: 0,
      issuedDate: new Date(),
      photos: [],
      content: '',
      internetRating: 0,
      neighborhoodRating: 0,
      neighborRating: 0,
      communicationRating: 0,
    } as Opinion;
    this.close();
  }

  public close(): void {
    this.formGroup.reset();
    this.visibleChange.emit(false);
  }
}
