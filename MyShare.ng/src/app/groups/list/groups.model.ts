import { ServicesUnit } from "../../services/unit.services";
import { IGroupFull } from "../../shared/interfaces";

export class GroupsViewModel {
  groups: IGroupFull[];

  userId: string;

  constructor(private services: ServicesUnit) {
    this.userId = localStorage.getItem("id");
    this.loadGroups();
  }

  loadGroups() {
    this.services.spinner.show();
    this.groups = [];
    this.services.angularFirebaseService.userGroups(localStorage.getItem('id'))
      .then(memberRefs => {
        memberRefs.forEach(groupRef => {
          this.services.angularFirebaseService.getGroup(groupRef.id)
            .subscribe(_group => {
              const index = this.groups.findIndex(x => x.id === groupRef.id)
              if (index > -1) {
                this.groups[index] = { id: groupRef.id, ..._group };
              }
              else {
                this.groups.push({ id: groupRef.id, ..._group });
              }
            });
        });
        this.services.spinner.hide();
      });
  }
}