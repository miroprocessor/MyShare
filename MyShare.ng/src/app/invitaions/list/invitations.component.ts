import { Component, OnInit } from "@angular/core";
import { ServicesUnit } from "../../services/unit.services";
import { InvitationsModel } from "./invitations.model";

@Component({
  selector: "app-invitations",
  templateUrl: "./invitations.component.html",
  styleUrls: ["./invitations.component.css"]
})
export class InvitationsComponent implements OnInit {
  model: InvitationsModel;
  constructor(private services: ServicesUnit) {
    this.model = new InvitationsModel(this.services);
  }

  ngOnInit() { }

  onAccept(groupId: string) {
    if (confirm('if you accepted this invitation, you will be member of this group and will share its expenses.\n are you sure?')) {
      this.model.accept(groupId);
    }
  }

  onReject(groupId: string) {
    this.model.reject(groupId);
  }

  onGroupDetails(groupName: string, groupId: string) {
    this.services.sharedData.set(groupId, groupName);
    this.services.route.navigate(["/groups/details"]);
  }
}
