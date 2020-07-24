import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  isAuth = false;
  authSubscription: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)]
      })
    });
  }

  AuthSubscription() {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }

  /* MeanStack Method */
  onSubmit() {
    this.isLoading = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.authService.loginUser(
      this.loginForm.value.email,
      this.loginForm.value.password
    );

    console.log('Login-component: ' + JSON.stringify(this.loginForm.value));

    this.isLoading = false;
  }
}
