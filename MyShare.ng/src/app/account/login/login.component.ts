import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { ServicesUnit } from '../../services/unit.services';
import { LoginService } from '../../services/login.service';
import * as firebase from "firebase";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  windowRef: any;

  constructor(private services: ServicesUnit, private loginService: LoginService) {
    this.services.authGuard.isAuthorized.next(false);
  }

  ngOnInit() {

    this.loginForm = new FormGroup({
      'txtPhone': new FormControl(null, Validators.required),
      'txtName': new FormControl(null, Validators.required)
    });

    this.windowRef = this.loginService.getWindow();

    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

    this.windowRef.recaptchaVerifier.render();

  }

  onSubmit() {
    this.services.spinner.show();

    const phone = this.loginForm.get('txtPhone').value;
    const name = this.loginForm.get('txtName').value;

    this.services.angularFirebaseService.login(phone, this.windowRef.recaptchaVerifier)
      .then(result => {
        this.services.spinner.hide();
        this.loginService.confirmationResult = result;
        this.loginService.user = { name: name, phone: phone };
        this.services.toastrSevice.success('we have sent a verfication code to your phone.');

        this.services.route.navigate(['/account/verify'])

      })
      .catch(error => {
        this.services.toastrSevice.error(error.message);
        this.services.spinner.hide();
      });
  }
}
