import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IGroup } from "../../shared/interfaces";
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

    let group: IGroup = {
      name: this.newgroupForm.get("txtName").value,
      bio: this.newgroupForm.get("txtBio").value,
      admin: localStorage.getItem('id'),
      totals: 0,
      membersCount: 1
    }
    this.services.spinner.show();

    this.services.angularFirebaseService.addGroup(group)
      .then(() => {
        this.services.spinner.hide();
        this.services.route.navigate(["/groups"]);
      })
      .catch((_error) => {
        this.services.spinner.hide();
        this.services.toastrSevice.error(_error);
      })
  }
  onCancel() {
    this.services.route.navigate(["/groups"]);
  }
}
