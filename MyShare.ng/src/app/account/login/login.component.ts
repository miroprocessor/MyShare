import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { ServicesUnit } from '../../services/unit.services';
import { SideBarModel } from '../../shared/sidebar/sidebar.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private services: ServicesUnit) {
    this.services.authGuard.isAuthorized.next(false);
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'txtPhone': new FormControl(null, Validators.required),
      'txtPassword': new FormControl(null, Validators.required)
    })
  }

  onSubmit() {
    this.services.spinner.show();

    const phone = this.loginForm.get('txtPhone').value;
    const password = this.loginForm.get('txtPassword').value;

    this.services.angularFirebaseService.getUser(phone)
      .subscribe(userDoc => {
        this.services.spinner.hide();
        if (userDoc && userDoc.password === password) {
          localStorage.setItem("id", phone);
          localStorage.setItem("name", userDoc.name);
          this.services.route.navigate(['/']);
        }
        else {
          this.services.toastrSevice.error('wrong phone number and password.');
        }
      },
        error => {
          this.services.toastrSevice.error('wrong phone number and password.');
          this.services.spinner.hide();
        })
  }

  onRegister() {
    this.services.route.navigate(['/account/register'])
  }
}
