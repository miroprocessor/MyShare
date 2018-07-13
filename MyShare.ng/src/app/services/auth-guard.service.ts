import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from "@angular/core";

import { AngularFireAuth } from "angularfire2/auth";
import { Subject } from "rxjs";
import { Observable } from "rxjs/Observable";
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Injectable()
export class AuthGuard implements CanActivate {

    isAuthorized: Subject<boolean> = new Subject<boolean>();

    constructor(private router: Router, private fbAuth: AngularFireAuth) {
        this.isAuthorized = new Subject<boolean>();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {// | Promise<boolean> | boolean {

        return this.fbAuth.authState.pipe(switchMap(user => {
            if (user) {
                this.isAuthorized.next(true);
                return of(true);
            }
            else {
                this.isAuthorized.next(false);
                this.router.navigate(['/account/login']);
                return of(false);
            }
        }));
    }

    logout() {
        localStorage.clear();
        this.fbAuth.auth.signOut();
        this.isAuthorized.next(false);
        this.router.navigate(['/account/login']);
    }
}