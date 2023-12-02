import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { LoginUser } from 'src/app/consts';
import { AccountService } from '../../core/services/account.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cs-login-panel',
  template: `
    <div class="cs-login-panel">
      <div class="cs-login-panel--logo"></div>
      <form [formGroup]="formGroup" class="cs-login-panel--form">
        <mat-form-field
          appearance="outline"
          class="cs-login-panel--form__input"
        >
          <mat-label>E-mail</mat-label>
          <input matInput formControlName="mail" />
          <mat-error class="cs-register-panel--error-message">
            Błędny e-mail
          </mat-error>
        </mat-form-field>
        <mat-form-field
          appearance="outline"
          class="cs-login-panel--form__input"
        >
          <mat-label>Hasło</mat-label>
          <input matInput type="password" formControlName="password" />
        </mat-form-field>
        <div class="cs-register-panel--error-message">* pole jest wymagane</div>
        <div class="cs-login-panel--form__action-buttons">
          <button
            mat-flat-button
            [disabled]="isSubmitDisabled()"
            (click)="submit()"
            color="primary"
          >
            Zaloguj
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
export class LoginPanelComponent implements OnInit {
  mailCtrl: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordCtrl: FormControl = new FormControl('', [Validators.required]);

  formGroup: FormGroup = new FormGroup(
    {
      mail: this.mailCtrl,
      password: this.passwordCtrl,
    },
    [Validators.required]
  );

  constructor(
    private accountService: AccountService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {}

  public isClearDisabled(): boolean {
    return !(this.mailCtrl.value !== '' || this.passwordCtrl.value !== '');
  }

  public isSubmitDisabled(): boolean {
    return this.formGroup.invalid || !this.formGroup.touched;
  }

  public clear(): void {
    this.mailCtrl.setValue('');
    this.passwordCtrl.setValue('');
  }

  public submit(): void {
    const user: LoginUser = {
      mail: this.mailCtrl.value,
      password: this.passwordCtrl.value,
    };
    // this.accountService.login(user);
    // this.authenticationService.setLoginState = true;
    this.router.navigate(['']);
  }
}
