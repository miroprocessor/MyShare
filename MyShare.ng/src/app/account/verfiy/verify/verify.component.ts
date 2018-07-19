import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { ServicesUnit } from '../../../services/unit.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUser } from '../../../shared/interfaces';
import { MessagingService } from '../../../services/messaging.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  verifyForm: FormGroup;

  constructor(private services: ServicesUnit, private loginService: LoginService, private messagingService: MessagingService) {
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
        localStorage.setItem('id', this.loginService.user.phone)
       
        this.services.angularFirebaseService.addUser(this.loginService.user)
          .then(() => {
            localStorage.setItem('name', this.loginService.user.name)
            this.services.authGuard.isAuthorized.next(true);
            this.services.toastrSevice.success('you logged in!');
            this.services.route.navigate(['/']);
            this.services.spinner.hide();
          })
          .catch(() => {
            this.services.spinner.hide();
            this.services.toastrSevice.error('faild to login, try later.');
          });
        this.messagingService.getPermission();
        this.messagingService.receiveMessage();
      })
      .catch(error => {
        this.services.toastrSevice.error("wrong verification code")
        this.services.spinner.hide();
      });
  }


}
