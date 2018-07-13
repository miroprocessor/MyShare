import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { ServicesUnit } from '../../../services/unit.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUser } from '../../../shared/interfaces';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  verifyForm: FormGroup;

  constructor(private services: ServicesUnit, private loginService: LoginService) {
    this.services.authGuard.isAuthorized.next(false);

    if (!this.loginService.confirmationResult) {
      this.services.route.navigate(['/account/login']);
    }
  }

  ngOnInit() {

    this.verifyForm = new FormGroup({
      'txtCode': new FormControl(null, Validators.required)
    });
  }


  onVerfiy() {
    this.services.spinner.show();
    const verificationCode = this.verifyForm.get('txtCode').value;
    this.loginService.confirmationResult
      .confirm(verificationCode)
      .then(result => {
        localStorage.setItem('id', result.user.uid)
        const user: IUser = {
          name: this.loginService.name
        }
        this.services.angularFirebaseService.addUser(result.user.uid, user)
          .then(() => {
            this.services.authGuard.isAuthorized.next(true);
            this.services.toastrSevice.success('you logged in!');
            this.services.route.navigate(['/']);
            this.services.spinner.hide();
          })
          .catch(error => {
            this.services.spinner.hide();
            this.services.toastrSevice.error('faild to login, try later.');
          });

      })
      .catch(error => {
        console.log(error, "wrong verification code")
        this.services.spinner.hide();
      });
  }


}
