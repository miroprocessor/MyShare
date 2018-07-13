import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  confirmationResult:any;
  name:string;

  constructor() { }

  getWindow() {
    return window;
  }
}
