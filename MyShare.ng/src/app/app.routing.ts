import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthGuard } from './services/auth-guard.service';

import { HomeComponent } from './home/home.component';
import { GroupsComponent } from './groups/list/groups.component';
import { NewGroupComponent } from './groups/add/new-group.component';
import { GroupDetailsComponent } from './groups/details/group-details.component';
import { MyExpensesComponent } from './expenses/list/user/my-expenses.component';
import { SpentComponent } from './expenses/add/spent.component';
import { CloseComponent } from './expenses/close/close/close.component';
import { InvitationsComponent } from './invitaions/list/invitations.component';
import { InviteMemberComponent } from './invitaions/invite/invite-member.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { NewNeedComponent } from './needs/add/new-need/new-need.component';
import { GroupsNeedsComponent } from './needs/list/groups-needs/groups-needs.component';

export const appRoutes: Routes = [
    { path: "home", canActivate: [AuthGuard], component: HomeComponent },
    { path: "groups", canActivate: [AuthGuard], component: GroupsComponent },
    { path: "groups/new-group", canActivate: [AuthGuard], component: NewGroupComponent },
    { path: "groups/details", canActivate: [AuthGuard], component: GroupDetailsComponent },
    { path: "expenses", canActivate: [AuthGuard], component: MyExpensesComponent },
    { path: "expenses/spent", canActivate: [AuthGuard], component: SpentComponent },
    { path: "expenses/close", canActivate: [AuthGuard], component: CloseComponent },
    { path: "invitations", canActivate: [AuthGuard], component: InvitationsComponent },
    { path: "invitations/invite", canActivate: [AuthGuard], component: InviteMemberComponent },

    { path: "needs", canActivate: [AuthGuard], component: GroupsNeedsComponent },    
    { path: "needs/new-need", canActivate: [AuthGuard], component: NewNeedComponent },
    
    { path: "account/login", component: LoginComponent },
    { path: "account/register", component: RegisterComponent },

    { path: "**", redirectTo: 'home', pathMatch: 'full', canActivate: [AuthGuard] },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(appRoutes),
        FormsModule,
        NgbModule,
        ReactiveFormsModule
    ],
    declarations: [
        HomeComponent,
        GroupsComponent,
        NewGroupComponent,
        GroupDetailsComponent,
        MyExpensesComponent,
        SpentComponent,
        CloseComponent,
        InvitationsComponent,
        InviteMemberComponent,
        LoginComponent,
        RegisterComponent
    ],
    providers: [
        AuthGuard
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {

}