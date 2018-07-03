import { ServicesUnit } from "../../services/unit.services";
import { enums } from "../../shared/enums";

export class InvitationsModel {
  invitations: any[];

  constructor(private services: ServicesUnit) {
    this.loadInivtaitons();
  }

  loadInivtaitons() {
    this.services.spinner.show();
    this.invitations = [];
    this.services.firebaseFunctions.getInvitations(localStorage.getItem('id'))
      .then((response) => {
        this.invitations = response.json();
        this.services.spinner.hide();
      })
      .catch((error) => {
        this.services.spinner.hide();
      }
      );
  }

  accept(invitationId: string, groupId: string) {
    this.services.spinner.show();
    const that = this;
    this.services.firebaseFunctions.acceptInvitation(invitationId, groupId, localStorage.getItem('id'))
      .then(function (result) {
        that.loadInivtaitons();
        that.services.toastrSevice.success('invitation is accepted successfully');
        that.services.spinner.hide();
      })
      .catch(function (e) {
        that.services.toastrSevice.error('error while accepting the invitation, please try later.');
        that.services.spinner.hide();
      });
  }

  reject(invitationId: string) {
    this.services.spinner.show();
    const that = this;
    this.services.firebaseFunctions.reject(invitationId)
      .then(function (result) {
        that.loadInivtaitons();
        that.services.toastrSevice.success('invitation is rejected successfully');
        that.services.spinner.hide();
      })
      .catch(function (e) {
        that.services.toastrSevice.error('error while rejecting the invitation, please try later.');
        that.services.spinner.hide();
      });
  }
}
