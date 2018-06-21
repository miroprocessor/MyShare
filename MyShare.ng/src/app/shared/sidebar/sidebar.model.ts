import { AuthGuard } from "../../services/auth-guard.service";
import { Observable } from "@firebase/util";
import { Subject } from "rxjs";

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    isProtected: boolean
}

const ROUTES: RouteInfo[] = [
    { path: '/groups', title: 'My Groups', icon: 'design_app', class: '', isProtected: true },
    { path: '/expenses', title: 'My Expenses', icon: 'business_money-coins', class: '', isProtected: true },
    { path: '/invitations', title: 'Invitations', icon: 'ui-1_email-85', class: '', isProtected: true },
    { path: '/needs', title: 'Needs', icon: 'shopping_basket', class: '', isProtected: true },
  
    { path: 'account/login', title: 'Login', icon: 'design_app', class: '', isProtected: false },
    { path: 'account/register', title: 'Register', icon: 'design_app', class: '', isProtected: false }
];

export class SideBarModel {
    menuItems: Subject<RouteInfo[]>;
    showLogout: boolean = false;

    constructor(private authGuard: AuthGuard) {
        this.menuItems = new Subject<RouteInfo[]>();
        this.setMenuItems();
    }

    setMenuItems() {
        this.authGuard.isAuthorized.subscribe(isAuthorized => {
            this.menuItems.next(ROUTES.filter(_ => _.isProtected === isAuthorized));
            this.showLogout = isAuthorized;
        });
    }
}
