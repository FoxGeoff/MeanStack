import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  maxDate: Date;
  islLoading = true;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  /* MeanStack Method */
  onSubmit(form: NgForm) {

    console.log(form.value);
    if (form.invalid) {
      return;
    }

    this.islLoading = true;
    this.authService.createUser(
      form.value.email,
      form.value.password
    );
  }
}
