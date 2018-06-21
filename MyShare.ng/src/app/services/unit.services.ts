import { DataService } from "./data.service";
import { SpinnerStateService } from "./spinnerState.service";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { FirebaseFunctions } from "./firebase.functions";
import { AuthGuard } from "./auth-guard.service";
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class ServicesUnit {
  public route: Router;
  public spinner: SpinnerStateService;
  public sharedData: DataService;
  public firebaseFunctions: FirebaseFunctions;
  public authGuard: AuthGuard;
  public toastrSevice: ToastrService;
  public modalService: NgbModal;

  constructor(
    private _route: Router,
    private _spinner: SpinnerStateService,
    private _data: DataService,
    private _firebaseFunctions: FirebaseFunctions,
    private _authGuard : AuthGuard,
    private _toastrService: ToastrService,
    private _modalService: NgbModal
  ) {
    this.route = _route;
    this.spinner = _spinner;
    this.sharedData = _data;
    this.firebaseFunctions = _firebaseFunctions;
    this.authGuard = _authGuard;
    this.toastrSevice = _toastrService;
    this.modalService = _modalService;
  }
}
