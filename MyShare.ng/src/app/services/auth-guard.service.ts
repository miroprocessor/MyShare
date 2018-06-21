import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { SideBarModel } from "../shared/sidebar/sidebar.model";
import { Subject } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {

    isAuthorized: Subject<boolean> = new Subject<boolean>();
    sidebarModel: SideBarModel;

    constructor(private router: Router) {
       // this.isAuthorized = new Subject<boolean>();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        var userId = localStorage.getItem('userId');
        if (userId) {
            this.isAuthorized.next(true);
            return true;
        }
        else {
            this.isAuthorized.next(false);
            this.router.navigate(['/account/login']);
            return false;
        }
    }

    logout() {
        localStorage.clear();
        this.isAuthorized.next(false);
        this.router.navigate(['/account/login']);
    }
}