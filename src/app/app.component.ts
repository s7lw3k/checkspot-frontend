import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './core/models/user.model';
import { AuthenticationService } from './core/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    if (this.authenticationService.stableUser.isLogin) {
      router.navigate(['']);
    } else {
      router.navigate(['login']);
    }
  }
  // Inne metody komponentu
}
