import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  emailError = "Email format: example@gov.za";
  passwordError = "Permitted characters: 0-9, a-z, A-Z, @, *, #"
  submitted = false;

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

  onLogin(form: NgForm) {
    this.submitted = true;
    if (form.invalid) {
      return;
    }
    this.authService.login(form.value.email, form.value.password).catch(err => {
      // console.log(err);
    });
  }

}
