import { Component, OnInit } from "@angular/core";
import { ServicesUnit } from "../../services/unit.services";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { InviteModel } from "./invite.model";

@Component({
  selector: "app-invite-member",
  templateUrl: "./invite-member.component.html",
  styleUrls: ["./invite-member.component.css"]
})
export class InviteMemberComponent implements OnInit {
  inviteForm: FormGroup;
  inviteModel: InviteModel;

  constructor(public services: ServicesUnit) {
    if (!this.services.sharedData.groupId) {
      this.services.route.navigate(["/groups"]);
    }
    else {
      this.services.spinner.show();
      this.services.angularFirebaseService.getGroup(this.services.sharedData.groupId)
        .subscribe(group => {
          this.services.spinner.hide();
          if (group.admin !== localStorage.getItem('id')) {
            this.services.toastrSevice.error('you are not the group admin to invite new members.');
            this.services.route.navigate(["/groups"]);
          }
        });
      this.inviteModel = new InviteModel(this.services);
    }
  }


  ngOnInit() {
    this.inviteForm = new FormGroup({
      txtPhone: new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    const memberPhone = this.inviteForm.get("txtPhone").value;
    this.inviteModel.send(memberPhone);
  }

  onDetails() {
    this.services.route.navigate(['/groups/details']);
  }
}
