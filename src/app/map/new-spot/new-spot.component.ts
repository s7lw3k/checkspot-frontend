import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
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
import { Opinion, Price } from 'src/app/core/models/opinion.model';
import { Address } from 'src/app/core/models/address.model';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'new-spot',
  template: `
    <div class="cs-new-spot" *ngIf="visible" [@newSpotAnimation]>
      <div class="cs-new-spot--topBar">
        <div class="cs-new-spot--topBar__title">
          Dodaj swoją opinie o tym miejscu!
        </div>
        <button mat-icon-button color="primary" (click)="close()">
          <mat-icon fontIcon="close"></mat-icon>
        </button>
      </div>
      <div class="cs-new-spot--opinionSection">
        <form [formGroup]="formGroup" class="cs-new-spot--form">
          <mat-form-field appearance="outline">
            <mat-label>Opisz to miejsce w kilku słowach</mat-label>
            <input
              matInput
              formControlName="name"
              (keydown)="checkIfTooLong(nameCtrl, 40)"
            />
            <mat-hint [align]="'end'">{{ nameCtrl.value?.length }}/40</mat-hint>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Twoja opinia o tym miejscu</mat-label>
            <textarea
              matInput
              formControlName="content"
              (keydown)="checkIfTooLong(contentCtrl, 500)"
              class="cs-new-spot--form__textarea"
            ></textarea>
            <mat-hint [align]="'end'"
              >{{ contentCtrl.value?.length }}/500</mat-hint
            >
          </mat-form-field>
        </form>
        @for (section of sections; track section.value) {
        <cs-new-spot-section
          [title]="section.title"
          [content]="section.content"
          [(rating)]="section.value"
        />
        }
        <p class="cs-new-spot--address__title">Adres jaki oceniasz</p>
        <form [formGroup]="addressGroup" class="cs-new-spot--address">
          <mat-form-field appearance="outline">
            <mat-label>Ulica</mat-label>
            <input matInput formControlName="streetName" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Numer budynku</mat-label>
            <input matInput formControlName="houseNumber" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>numer mieszkania</mat-label>
            <input
              matInput
              type="number"
              min="1"
              formControlName="apartmentNumber"
            />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Piętro</mat-label>
            <input matInput type="number" formControlName="floor" />
          </mat-form-field>
        </form>
      </div>
      <div class="cs-new-spot--bottomBar">
        <button
          mat-raised-button
          color="primary"
          [disabled]="isSubmitDisabled()"
          (click)="submit()"
        >
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

  nameCtrl: FormControl = new FormControl('', Validators.required);
  contentCtrl: FormControl = new FormControl('', Validators.required);

  formGroup: FormGroup = new FormGroup({
    name: this.nameCtrl,
    content: this.contentCtrl,
  });

  streetCtrl: FormControl = new FormControl('', Validators.required);
  houseCtrl: FormControl = new FormControl('', Validators.required);
  apartmentCtrl: FormControl<number | null> = new FormControl(null);
  floorCtrl: FormControl<number | null> = new FormControl(null);

  addressGroup: FormGroup = new FormGroup({
    streetName: this.streetCtrl,
    houseNumber: this.houseCtrl,
    apartmentNumber: this.apartmentCtrl,
    floor: this.floorCtrl,
  });

  sections = [
    {
      title: 'Internet',
      content: 'Twoja opinia o internecie w tej okolicy:',
      value: 0,
    },
    {
      title: 'Okolica',
      content: 'Twoja opinia o okolicy w tej okolicy:',
      value: 0,
    },
    {
      title: 'Sąsiedzi',
      content: 'Twoja opinia o sąsiedztwie w tej okolicy:',
      value: 0,
    },
    {
      title: 'Komunikacja',
      content: 'Twoja opinia o komunikacji w tej okolicy:',
      value: 0,
    },
  ];

  constructor(
    private store: Store<AppState>,
    private authenticationService: AuthenticationService
  ) {}

  public submit() {
    const opinion: Opinion = {
      photos: [],
      shortContent: this.nameCtrl.value,
      content: this.contentCtrl.value,
      internetRating: this.sections[0].value,
      neighborhoodRating: this.sections[1].value,
      neighborRating: this.sections[2].value,
      communicationRating: this.sections[3].value,
      price: Price.$,
    };
    const address: Address = {
      streetName: this.streetCtrl.value,
      houseNumber: this.houseCtrl.value,
      apartmentNumber: this.apartmentCtrl.value
        ? this.apartmentCtrl.value
        : undefined,
      floor: this.floorCtrl.value ? this.floorCtrl.value : undefined,
    };

    this.authenticationService.currentLoggedUser.subscribe((user) => {
      const newSpot: Spot = {
        id: Math.floor(Math.random() * 10000),
        address,
        issuedBy: user,
        issuedDate: new Date(),
        opinion: opinion,
        coordinates: this.newCords,
      };
      this.store.dispatch(new AddSpot({ spot: newSpot }));
      this.unSpot();
    });
  }

  public unSpot(): void {
    this.submitNewSpot.emit();
    for (const section of this.sections) {
      section.value = 0;
    }
    this.formGroup.setValue({ name: '', content: '' });
    this.addressGroup.reset();
    this.formGroup.markAsUntouched();
    this.addressGroup.markAsUntouched();
    this.close();
  }

  public close(): void {
    this.visibleChange.emit(false);
  }

  public checkIfTooLong(
    valueControl: FormControl<string>,
    maxLength: number
  ): void {
    if (valueControl.value.length > maxLength - 1)
      valueControl.setValue(valueControl.value.slice(0, maxLength - 1));
  }

  public isSubmitDisabled(): boolean {
    for (const section of this.sections) {
      if (section.value === 0) {
        return true;
      }
    }
    return this.formGroup.invalid || this.addressGroup.invalid;
  }
}
