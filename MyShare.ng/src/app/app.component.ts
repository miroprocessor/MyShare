import { Component } from '@angular/core';
import { AuthGuard } from './services/auth-guard.service';
import { Router } from '@angular/router';
import { SpinnerStateService } from './services/spinnerState.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authGuard: AuthGuard, private route: Router, public spinnerState: SpinnerStateService) { }


  onLogout() {
    this.authGuard.logout();
    this.route.navigate(['/account/login']);
  }
}