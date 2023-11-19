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
import { User } from '../../core/models/user.model';
import { PopupService } from '../../core/services/popup.service';
import { SpotService } from '../../core/services/spot.service';

const admin: User = {
  id: 1,
  name: 'admin',
  mail: 'admin@admin',
  password: 'a',
  createdDate: new Date(),
  darkMode: false,
};
@Component({
  selector: 'new-spot-popup',
  template: `
    <div>Add Spot</div>
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
    <button mat-flat-button color="primary" (click)="test()">test</button>
  `,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
})
export class NewSpotComponent {
  @Output() newSpotCreated: EventEmitter<any> = new EventEmitter();

  nameCtrl: FormControl = new FormControl('');
  desCtrl: FormControl = new FormControl('');

  formGroup: FormGroup = new FormGroup({
    name: this.nameCtrl,
    des: this.desCtrl,
  });
  constructor(
    private spotService: SpotService,
    private popupService: PopupService
  ) {}

  public test() {
    this.spotService.createSpot(this.nameCtrl.value, this.desCtrl.value);
    this.desCtrl.setValue('');
    this.nameCtrl.setValue('');
    this.popupService.closePopup();
  }
}
