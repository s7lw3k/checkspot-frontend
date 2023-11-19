import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../core/models/user.model';

@Injectable({ providedIn: 'root' })
export class ServiceNameService {
  constructor(private http: HttpRequest<User>) {}
}
