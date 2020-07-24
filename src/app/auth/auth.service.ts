import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {
  private isAuthenticated = false;
  authChangeListener = new Subject<boolean>();
  private user: User;
  private token: string;
  private authStatus$ = new Subject<boolean>();

  constructor(private router: Router, private http: HttpClient) { }

  /* MeanStack Mehod */
  getToken() {
    return this.token;
  }

  /* MeanStack Mehod */
  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  /* MeanStack Mehod */
  getAuthStatus$() {
    return this.authStatus$.asObservable();
  }

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
      .post<{ token: string }>('http://localhost:3000/api/users/login', authData)
      .subscribe(response => {
        console.log(`From auth-serviceloginUser: ${response}`);
        const token = response.token;
        this.token = token;

        if (token) {
          this.isAuthenticated = true;
          this.authStatus$.next(true);
        }

      });
  }

  /* MeanStack Mehod */
  logoutUser() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatus$.next(false);
  }

  /* my-fittness method */
  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 1000).toString()
    };
    this.authChangeListener.next(true);
    this.router.navigate(['/create']);
  }

  /* my-fittness method */
  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 1000).toString()
    };
    this.authChangeListener.next(true);
    this.router.navigate(['/create']);
    console.log('login!');
  }

  /* my-fittness method */
  logout() {
    this.user = null;
    this.authChangeListener.next(false);
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
