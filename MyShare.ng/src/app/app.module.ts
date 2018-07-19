import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AngularFireModule } from 'angularfire2'
import { AngularFirestoreModule } from 'angularfire2/firestore'

import { environment } from '../environments/environment';

import { ComponentsModule } from './shared/components.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { AuthGuard } from './services/auth-guard.service';
import { SpinnerStateService } from './services/spinnerState.service';
import { DataService } from './services/data.service';
import { ServicesUnit } from './services/unit.services';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NewNeedComponent } from './needs/add/new-need/new-need.component';
import { GroupsNeedsComponent } from './needs/list/groups-needs/groups-needs.component';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MessagingService } from './services/messaging.service';



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
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule
  ],
  declarations: [
    AppComponent,
    SpinnerComponent,
    NewNeedComponent,
    GroupsNeedsComponent
  ],
  providers: [
    AuthGuard,
    SpinnerStateService,
    DataService,
    ServicesUnit,
    ToastrService,
    NgbAccordionConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private messagingService: MessagingService) {

    messagingService.getPermission();
    messagingService.receiveMessage();
  }
}
