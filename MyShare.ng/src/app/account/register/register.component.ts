import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IRegisterModel } from '../../shared/interfaces';
import { ServicesUnit } from '../../services/unit.services';
import { RegisterModel } from './register.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  model: RegisterModel;

  constructor(private services: ServicesUnit) {
    this.services.authGuard.isAuthorized.next(false);
    this.model = new RegisterModel(this.services);
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      'txtName': new FormControl(null, Validators.required),
      'txtPassword': new FormControl(null, Validators.required),
      'txtPhone': new FormControl(null, Validators.required),
    });
  }

  onSubmit() {

    this.model.register(this.registerForm.get('txtPhone').value,
      {
        'name': this.registerForm.get('txtName').value,
        'password': this.registerForm.get('txtPassword').value
      });
  }

  onLogin() {
    this.services.route.navigate(['/account/login']);
  }
}
