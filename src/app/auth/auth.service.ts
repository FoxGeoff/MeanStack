import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';

@Injectable()
export class AuthService {
  private isAuthenticated = false;
  authChangeListener = new Subject<boolean>();
  private user: User;
  private token: string;
  private authStatus$ = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer;
  private userId: string;

  constructor(private router: Router, private http: HttpClient) { }

  /* MeanStack Method */
  getUserId() {
    return this.userId;
  }

  /* MeanStack Method */
  getToken() {
    return this.token;
  }

  /* MeanStack Method */
  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  /* MeanStack Method */
  getAuthStatus$() {
    return this.authStatus$.asObservable();
  }

  /* MeanStack Method */
  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post('http://localhost:3000/api/users/signup', authData)
      .subscribe(response => {
        console.log(`From auth-service createUser: ${response}`);
      });
  }

  /* MeanStack Method */
  loginUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post<{ token: string, expiresIn: number, userId: string }>('http://localhost:3000/api/users/login', authData)
      .subscribe(response => {
        console.log(`From auth-serviceloginUser: ${response}`);
        const token = response.token;
        this.token = token;

        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);

          /*
          this.tokenTimer = setTimeout(() => {
            this.logoutUser();
          }, expiresInDuration * 1000);
          */

          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatus$.next(true);

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);

          this.saveAuthData(token, expirationDate, this.userId);

          this.router.navigate(['/']);
        }

      });
  }

  /* MeanStack Method - auto authenticate use*/
  autoAuthUser() {
    const authInfomation = this.getAuthData();
    if (!authInfomation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfomation.expirationDate.getTime() - now.getTime(); // mil seconds
    if (expiresIn > 0) {
      this.token = authInfomation.token;
      this.isAuthenticated = true;

      this.userId = authInfomation.userId;

      this.setAuthTimer(expiresIn / 1000); // seconds
      this.authStatus$.next(true);
    }
  }

  /* MeanStack Method */
  logoutUser() {
    this.token = null;
    this.userId = null;

    this.isAuthenticated = false;
    this.authStatus$.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  /* MeanStack Method */
  private setAuthTimer(duration: number) {

    console.log(`Setting timer: ${duration}`);

    this.tokenTimer = setTimeout(() => {
      this.logoutUser();
    }, duration * 1000);
  }

  /* MeanStack Method */
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('usedId', userId);
  }

  /* MeanStack Method */
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('usedId');
  }

  /* MeanStack Method */
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('usedId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId
    };
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
