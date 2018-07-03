import { ServicesUnit } from "../../services/unit.services";
import { enums } from "../../shared/enums";
import { IGroupFull } from "../../shared/interfaces";

export class InvitationsModel {
  groups: IGroupFull[];

  noInvitations: boolean = false;

  constructor(private services: ServicesUnit) {
    this.loadInivtaitons();
  }

  loadInivtaitons() {
    this.services.spinner.show();
    this.services.angularFirebaseService.getInvitations(localStorage.getItem('id'))
      .subscribe(invitations => {
        this.services.spinner.hide();
        this.groups = [];

        this.noInvitations = invitations.length === 0;

        invitations.forEach(inv => {

          const groupId = inv.payload.doc.id;

          for (var userId in inv.payload.doc.data()) {

            if (userId === localStorage.getItem('id')) {
              this.services.angularFirebaseService.getGroup(groupId)
                .subscribe(_ => {
                  this.groups.push({ id: groupId, ..._ });
                  this.services.spinner.hide();
                });
            }
          }
        });
      });
  }

  accept(groupId: string) {
    this.services.spinner.show();
    this.services.angularFirebaseService.acceptInvitation(groupId, localStorage.getItem('id'))
      .then(() => {
        this.services.spinner.hide();
        this.services.toastrSevice.success('You accepted the invitation and became memeber');
      })
      .catch(() => {
        this.services.spinner.hide();
        this.services.toastrSevice.error('you didn\'t accept the invitation yet. Try later');
      });
  }

  reject(groupId: string) {
    this.services.spinner.show();
    this.services.angularFirebaseService.rejectInvitation(groupId, localStorage.getItem('id'))
      .then(() => {
        this.services.spinner.hide();
        this.services.toastrSevice.success('You rejected the invitation and they can\'t invite you again');
      })
      .catch(() => {
        this.services.spinner.hide();
        this.services.toastrSevice.error('you didn\'t reject the invitation yet. Try later');
      });
  }
}
