import { SpinnerStateService } from "../../services/spinnerState.service";
import { FirebaseFunctions } from "../../services/firebase.functions";
import { ServicesUnit } from "../../services/unit.services";

export class GroupsViewModel {
  groups: any[];

  userId: string;

  constructor(private services: ServicesUnit) {
    this.userId = localStorage.getItem("userId");
    this.loadGroups();
  }

  loadGroups() {
    this.services.spinner.show();
    this.groups = [];

    this.services.firebaseFunctions.getGroups(this.userId)
      .then((response) => {
        this.groups = response.json();
        this.services.spinner.hide();
        if (this.groups.length === 0) {
          this.services.toastrSevice.warning("You are not member in any group.");
        }
        else {
          this.groups.forEach(group => {
            this.services.firebaseFunctions.isGroupAdmin(group.id, localStorage.getItem('userId'))
              .then(response => {
                group.isAdmin = response.json();
              });
          });
        }
      })
      .catch((error) => {
        this.services.spinner.hide();
        this.services.toastrSevice.error("can't retrieve groups list, try later.");
      });

  }
}