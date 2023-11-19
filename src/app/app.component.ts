import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './core/models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private user: User = {
    id: 1,
    name: 'admin',
    mail: 'a@a.com',
    password: 'a',
    createdDate: new Date(),
    darkMode: false,
    isLogin: true,
  };
  constructor(private router: Router) {
    if (this.user.isLogin) {
      router.navigate(['']);
    } else {
      router.navigate(['login']);
    }
  }
}
