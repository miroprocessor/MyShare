import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as firebase from 'firebase'
import { ServicesUnit } from './unit.services';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  messaging = firebase.messaging();
  currentMessage = new BehaviorSubject(null)

  constructor(private services: ServicesUnit) {
    this.messaging.getToken().then(token => {
      if (token) {
        this.updateToken(token);
      }
    })
  }

  updateToken(token: string) {
    const phone = localStorage.getItem('id');
    if (phone) {
      this.services.angularFirebaseService.updateMessagingToken(phone, token);
    }
  }

  getPermission() {
    this.messaging.requestPermission()
      .then(() => {
        return this.messaging.getToken()
      })
      .then(token => {
        this.updateToken(token);
      });
  }

  receiveMessage() {
    this.messaging.onMessage((payload) => {
      this.services.toastrSevice.info(payload.notification.title);
      this.currentMessage.next(payload)
    });
  }
}
