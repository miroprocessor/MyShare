import { Injectable } from '@angular/core';
import { IUser } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  confirmationResult: any;
  user: IUser;

  constructor() { }

  getWindow() {
    return window;
  }
}
