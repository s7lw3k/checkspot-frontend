import { Component, HostListener, OnInit } from '@angular/core';
import { LoginPanelComponent } from './login-panel/login-panel.component';
import { RegisterPanelComponent } from './register-panel/register-panel.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { TransplantedType } from '@angular/compiler';
import { ResizeEvent } from 'leaflet';
import {
  AnimationHelper,
  PanelTemplateParams,
} from '../helpers/animations-helper';
const delay = 350;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    LoginPanelComponent,
    RegisterPanelComponent,
    MatButtonModule,
    CommonModule,
  ],
  animations: [
    trigger('loginAnimation', [
      transition(':enter', [style({}), animate(delay + 10)]),
      transition(':leave', [style({}), animate(delay + 10)]),
    ]),
    trigger('registerAnimation', [
      transition(':enter', [animate(delay + 10)]),
      transition(':leave', [animate(delay + 10)]),
    ]),
    trigger('templateAnimation', [
      state(
        'login',
        style({
          right: '{{right}}%',
          color: 'black',
          zIndex: 1000,
          position: '{{position}}',
        }),
        {
          params: {
            right: 1,
            left: 1,
            midLeft: 60,
            top: 0,
            position: 'absolute',
          },
        }
      ),
      state(
        'register',
        style({
          color: 'black',
          zIndex: 1000,
          position: 'relative',
        }),
        {
          params: {
            right: 1,
            left: 1,
            midLeft: 60,
            top: 0,
            position: 'absolute',
          },
        }
      ),
      transition('login => register', [
        style({
          left: '{{left}}%',
          color: 'black',
          position: '{{position}}',
        }),
        animate(
          delay / 2,
          style({
            left: 'calc({{midLeft}}vw - 5%)',
            scale: 0.9,
            position: '{{position}}',
          })
        ),
        animate(
          delay / 2 + 10,
          style({
            left: '{{right}}%',
            scale: 1,
            position: '{{position}}',
          })
        ),
      ]),
      transition('register => login', [
        style({
          position: 'absolute',
          left: '10%',
        }),
        animate(
          delay / 2,
          style({
            left: 'calc({{midLeft}}vw - {{right}}%)',
            scale: 0.9,
            position: 'absolute',
          })
        ),
        animate(
          delay / 2,
          style({
            left: 'calc({{left}}vw - {{right}}%)',
            scale: 1,
            position: 'absolute',
          })
        ),
      ]),
    ]),
  ],
})
export class LoginComponent implements OnInit {
  panelTemplateParams: PanelTemplateParams;
  ngOnInit(): void {
    this.panelTemplateParams = AnimationHelper.getPanelTemplateParams(
      window.innerWidth > 1000
    );
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: ResizeEvent) {
    this.panelTemplateParams = AnimationHelper.getPanelTemplateParams(
      event.target.innerWidth > 1000
    );
  }
  register: boolean = false;

  get stateName() {
    return this.register ? 'register' : 'login';
  }

  get templateTitle() {
    return this.register ? '' : '';
  }

  get templateButtonContent() {
    return this.register
      ? 'Kliknij aby\n się zalogować'
      : 'Kliknij aby\n się zarejestrować';
  }
}
