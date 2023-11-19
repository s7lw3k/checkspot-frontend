import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AccountService } from '../../core/services/account.service';
import { RegUser } from 'src/app/consts';

@Component({
  selector: 'cs-register-panel',
  template: `
    <div class="cs-register-panel">
      <div class="cs-register-panel--logo"></div>
      <form [formGroup]="formGroup" class="cs-register-panel--form">
        <mat-form-field
          appearance="outline"
          class="cs-register-panel--form__input"
        >
          <mat-label>Nazwa użytkownika</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>
        <mat-form-field
          appearance="outline"
          class="cs-register-panel--form__input"
        >
          <mat-label>E-mail</mat-label>
          <input matInput type="mail" formControlName="mail" />
          <mat-error class="cs-register-panel--error-message">
            Błędny e-mail
          </mat-error>
        </mat-form-field>
        <mat-form-field
          appearance="outline"
          class="cs-register-panel--form__input"
        >
          <mat-label>Hasło</mat-label>
          <input matInput type="password" formControlName="password" />
          <mat-error class="cs-register-panel--error-message">
            Hasło powinno być nie krótsze niż 6 znaków, zawierać dużą oraz małą
            literę, znak specjalny oraz cyfrę.
          </mat-error>
        </mat-form-field>
        <div class="cs-register-panel--error-message">* pole jest wymagane</div>
        <div class="cs-register-panel--form__action-buttons">
          <button
            mat-flat-button
            [disabled]="isSubmitDisabled()"
            color="primary"
          >
            Zarejestruj
          </button>
          <button
            mat-stroked-button
            [disabled]="isClearDisabled()"
            (click)="clear()"
          >
            Wyczyść
          </button>
        </div>
      </form>
    </div>
  `,
  standalone: true,
  styleUrls: ['../login.component.scss'],
  imports: [
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
})
export class RegisterPanelComponent implements OnInit {
  private passwordRegExp =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;

  private nameRegExp = /^.{1,30}$/;

  nameCtrl: FormControl = new FormControl('', [
    Validators.pattern(this.nameRegExp),
    Validators.required,
  ]);
  mailCtrl: FormControl = new FormControl('', [
    Validators.email,
    Validators.required,
  ]);
  passwordCtrl: FormControl = new FormControl('', [
    Validators.pattern(this.passwordRegExp),
    Validators.required,
  ]);

  formGroup: FormGroup = new FormGroup(
    {
      name: this.nameCtrl,
      mail: this.mailCtrl,
      password: this.passwordCtrl,
    },
    [Validators.required]
  );

  constructor(private accountService: AccountService) {}

  ngOnInit() {}

  public isClearDisabled(): boolean {
    return !(
      this.nameCtrl.value !== '' ||
      this.mailCtrl.value !== '' ||
      this.passwordCtrl.value !== ''
    );
  }

  public isSubmitDisabled(): boolean {
    return this.formGroup.invalid || !this.formGroup.touched;
  }

  public clear(): void {
    this.nameCtrl.setValue('');
    this.mailCtrl.setValue('');
    this.passwordCtrl.setValue('');
  }

  public submit() {
    const newUser: RegUser = {
      name: this.nameCtrl.value,
      mail: this.mailCtrl.value,
      password: this.passwordCtrl.value,
    };
    this.accountService.register(newUser);
  }
}
