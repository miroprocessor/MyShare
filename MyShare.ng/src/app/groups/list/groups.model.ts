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
    this.services.angularFirebaseService.getUserGroups(localStorage.getItem('id'))
      .subscribe(memberRefs => {
        this.groups = [];
        memberRefs.forEach(groupRef => {
          const groupId = groupRef.payload.doc.id;
          this.services.angularFirebaseService.getGroup(groupId)
            .subscribe(_group => {
              const index = this.groups.findIndex(x => x.id === groupId)
              if (index > -1) {
                this.groups[index] = { id: groupId, ..._group };
              }
              else {
                this.groups.push({ id: groupId, ..._group });
              }
            });
        });
        this.services.spinner.hide();
      });
  }
}