import { Component, OnInit } from "@angular/core";
import { GroupsViewModel } from "./groups.model";
import { ServicesUnit } from "../../services/unit.services";

@Component({
  selector: "app-groups",
  templateUrl: "./groups.component.html",
  styleUrls: ["./groups.component.css"]
})
export class GroupsComponent implements OnInit {
  model: GroupsViewModel;

  constructor(private services: ServicesUnit) {
    this.model = new GroupsViewModel(this.services);
    this.services.sharedData.reset();
  }

  ngOnInit() {
  }

  onAddGroup() {
    this.services.route.navigate(["/groups/new-group"]);
  }

  onInvite(groupId: string, groupName: string, groupBio: string) {

    this.services.sharedData.set(groupId, groupName, groupBio);

    this.services.route.navigate(["/invitations/invite"]);
  }

  onDetails(groupId: string, groupName: string, groupBio: string) {

    this.services.sharedData.set(groupId, groupName, groupBio);
    this.services.route.navigate(["/groups/details"]);
  }

  onExpenses(groupId: string, groupName: string, groupBio: string) {

    this.services.sharedData.set(groupId, groupName, groupBio);

    this.services.route.navigate(["/expenses/close"]);
  }
}
