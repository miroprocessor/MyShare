import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { ComponentsModule } from './shared/components.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { environment } from '../environments/environment';
import { AuthGuard } from './services/auth-guard.service';
import { FirebaseFunctions } from './services/firebase.functions';
import { SpinnerStateService } from './services/spinnerState.service';
import { DataService } from './services/data.service';
import { ServicesUnit } from './services/unit.services';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { ServiceWorkerModule } from '@angular/service-worker';



@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpModule,
    ComponentsModule,
    NgbModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  declarations: [
    AppComponent,
    SpinnerComponent
  ],
  providers: [
    FirebaseFunctions,
    AuthGuard,
    SpinnerStateService,
    DataService,
    ServicesUnit,
    ToastrService,
    NgbAccordionConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
