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

    this.services.firebaseFunctions.login(this.loginForm.get('txtPhone').value, this.loginForm.get('txtPassword').value)
      .then((response) => {
        this.services.spinner.hide();
        if (response.status === 200) {
          const user = response.json();
          localStorage.setItem("userId", user.id);
          localStorage.setItem("phone", this.loginForm.get('txtPhone').value);
          this.services.route.navigate(['/']);
        }
        else if (response.status === 404){
          this.services.toastrSevice.error('wrong phone number and password.');
        }        
        this.services.spinner.hide();
      })
      .catch((error) => {
        this.services.toastrSevice.error('wrong phone number and password.');
        this.services.spinner.hide();
      })
  }

  onRegister() {
    this.services.route.navigate(['/account/register'])
  }
}
