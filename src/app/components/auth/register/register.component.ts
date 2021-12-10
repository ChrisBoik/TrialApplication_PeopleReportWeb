import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  emailError = "Email format: example@gov.za";
  passwordError = "Permitted characters: 0-9, a-z, A-Z, @, *, #";
  passwordConfirmError = "The passwords entered do not match."
  submitted = false;

  constructor(public authService: AuthService, public router: Router) { }

  ngOnInit() {
  }

  onRegister(form: NgForm): void {
    this.submitted = true;
    if (!form.valid) {
      return;
    } else {
      if (form.value.password !== form.value.passwordConfirm) {
        return;
      }
    }

    this.authService.createUser(form.value.email, form.value.password).then(result => {
      //if created user success
      // console.log(result)
      if (result.status === 201) {
        form.resetForm();
        this.router.navigate(['/']);
      }
    }).catch(err => {
      alert('An error occurred trying to register.');
    });
  }
}
