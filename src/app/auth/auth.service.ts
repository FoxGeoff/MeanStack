import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private user: User;

  constructor(private router: Router, private http: HttpClient) { }

  /* MeanStack Mehod */
  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post('http://localhost:3000/api/users/signup', authData)
      .subscribe(response => {
        console.log(`From auth-service createUser: ${response}`);
      });
  }

  /* MeanStack Mehod */
  loginUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post('http://localhost:3000/api/users/login', authData)
      .subscribe(response => {
        console.log(`From auth-serviceloginUser: ${response}`);
      });
  }

  /* my-fittness method */
  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 1000).toString()
    };
    this.authChange.next(true);
    this.router.navigate(['/create']);
  }

  /* my-fittness method */
  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 1000).toString()
    };
    this.authChange.next(true);
    this.router.navigate(['/create']);
    console.log('login!');
  }

  /* my-fittness method */
  logout() {
    this.user = null;
    this.authChange.next(false);
    this.router.navigate(['/login']);
    console.log('logout!');
  }

  /* my-fittness method */
  getUser() {
    return { ...this.user };
  }

  /* my-fittness method */
  isAuth() {
    return this.user != null;
  }
}
