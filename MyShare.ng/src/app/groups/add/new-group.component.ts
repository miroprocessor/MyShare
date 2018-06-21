import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SpinnerStateService } from "../../services/spinnerState.service";
import { Router } from "@angular/router";
import { IGroupModel, IMember } from "../../shared/interfaces";
import { ServicesUnit } from "../../services/unit.services";

@Component({
  selector: "app-new-group",
  templateUrl: "./new-group.component.html",
  styleUrls: ["./new-group.component.css"]
})
export class NewGroupComponent implements OnInit {
  newgroupForm: FormGroup;

  constructor(private services: ServicesUnit) {

  }

  ngOnInit() {
    this.newgroupForm = new FormGroup({
      txtName: new FormControl(null, Validators.required),
      txtBio: new FormControl(null)
    });
  }

  onSubmit() {
    let group: IGroupModel = {
      name: this.newgroupForm.get("txtName").value,
      bio: this.newgroupForm.get("txtBio").value,
      createdOn: new Date()
    };

    let member: IMember = {
      userId: localStorage.getItem('userId'),
      isAdmin: true
    }
    this.services.spinner.show();

    this.services.firebaseFunctions.createGroup(group, member)
      .then(() => {
        this.services.spinner.hide();
        this.services.route.navigate(["/groups"]);
      })
      .catch((_error) => {
        this.services.spinner.hide();
        this.services.toastrSevice.error(_error);
      })
  }
  onCancel(){
    this.services.route.navigate(["/groups"]);
  }
}
