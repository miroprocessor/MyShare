import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthGuard } from '../../services/auth-guard.service';
import { SideBarModel, RouteInfo } from './sidebar.model';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnChanges {
    model: SideBarModel;
    menuItems: RouteInfo[];

    constructor(private authGuard: AuthGuard) {
        this.model = new SideBarModel(this.authGuard);
    }

    ngOnInit() {
        this.model.menuItems.subscribe(routes => {
            this.menuItems = routes;
        });
    }

    ngOnChanges() {
        this.model.menuItems.subscribe(routes => {
            this.menuItems = routes;
        });
    }

    isMobileMenu() {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    };
}
