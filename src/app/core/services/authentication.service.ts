import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from 'src/app/consts';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private user: BehaviorSubject<User>;
  public stableUser: User;
  constructor(private http: HttpClient) {
    this.user = new BehaviorSubject<User>({
      id: 1,
      name: 'admin',
      mail: 'a@a.com',
      password: 'a',
      createdDate: new Date(),
      darkMode: false,
      isLogin: true,
    });
    this.user.subscribe((user) => {
      this.stableUser = user;
    });
  }

  get currentLoggedUser(): Observable<User> {
    return this.user;
    // return this.http.get<User>(`${environment.apiUrl}`);
  }
  set setLoginState(state: boolean) {
    this.user.asObservable().subscribe((user) => (user.isLogin = state));
    // return this.http.get<User>(`${environment.apiUrl}`);
  }
}
