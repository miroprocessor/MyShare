import { ServicesUnit } from "../../services/unit.services";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";

export class InviteModel {

    constructor(private services: ServicesUnit) {
    }

    send(memberPhone: string, modalRef?: NgbModalRef) {
        const currentUserPhone = localStorage.getItem("id");
        const groupId = this.services.sharedData.groupId;

        if (currentUserPhone === memberPhone) {
            this.services.toastrSevice.warning("you are inviting yourself!");
            return;
        }

        this.isGroupMember(groupId, memberPhone, () => {
            this.sendInvitation(memberPhone, modalRef)
        })

    }

    private sendInvitation(memberPhone: string, modalRef?: NgbModalRef) {
        this.services.spinner.show();
        this.services.angularFirebaseService.invite(this.services.sharedData.groupId, memberPhone)
            .then(() => {
                this.services.toastrSevice.success("your invitation has been sent successfully");
                if (modalRef) {
                    modalRef.close();
                }
                this.services.spinner.hide();
            })
            .catch(() => {
                this.services.toastrSevice.error('error while sending your invitation');
                this.services.spinner.hide();
            })
    }

    private isGroupMember(groupId, memberPhone, sentInvitation: () => void) {

        this.services.spinner.show();

        const getUser = (memberPhone) => {
            const user = this.services.angularFirebaseService.getUser(memberPhone);
            return user;
        }

        const getMembers = (groupId, memberPhone) => {
            const members = this.services.angularFirebaseService.groupMembers(groupId);
            return members;
        }
        getUser(memberPhone)
            .subscribe(user => {
                if (user) {
                    getMembers(groupId, memberPhone)
                        .subscribe(GroupMember => {
                            let canSend: boolean = true;
                            for (var phone in GroupMember) {
                                if (phone === memberPhone) {
                                    canSend = false;
                                }
                            }
                            if (canSend) {
                                sentInvitation();
                            }
                            else {
                                this.services.toastrSevice.warning('this phone number is already member!.')
                            }
                            this.services.spinner.hide();
                        });
                }
                else {
                    this.services.toastrSevice.error('this phone is not registered!.');
                    this.services.spinner.hide();
                }
            });
    }
}