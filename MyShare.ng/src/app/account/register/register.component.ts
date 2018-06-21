import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IRegisterModel } from '../../shared/interfaces';
import { ServicesUnit } from '../../services/unit.services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private services: ServicesUnit) {
    this.services.authGuard.isAuthorized.next(false);
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      'txtName': new FormControl(null, Validators.required),
      'txtPassword': new FormControl(null, Validators.required),
      'txtPhone': new FormControl(null, Validators.required),
    });
  }

  onSubmit() {
    this.services.spinner.show();
    this.services.firebaseFunctions.register(this.registerForm.get('txtName').value, this.registerForm.get('txtPhone').value, this.registerForm.get('txtPassword').value)
      .then((response) => {
        this.services.spinner.hide();
        const user = response.json();
        localStorage.setItem("userId", user.id);
        localStorage.setItem("phone", this.registerForm.get('txtPhone').value);
        this.services.route.navigate(["/"]);
      })
      .catch((error) => {
        this.services.spinner.hide();
        this.services.toastrSevice.error(error._body);
      })
  }

  onLogin() {
    this.services.route.navigate(['/account/login']);
  }
}
