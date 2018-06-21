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

  onAccept(invitationId: string, groupId: string) {
    this.model.accept(invitationId, groupId);
  }

  onReject(invitationId: string) {
    this.model.reject(invitationId);
  }

  onGroupDetails(groupName: string, groupId: string) {
    this.services.sharedData.set(groupId, groupName);
    this.services.route.navigate(["/groups/details"]);
  }
}
