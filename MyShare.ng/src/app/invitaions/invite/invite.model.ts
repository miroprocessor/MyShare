import { ServicesUnit } from "../../services/unit.services";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

export class InviteModel {

    constructor(private services: ServicesUnit) {

    }

    send(memberPhone: string, modalRef?: NgbModalRef) {
        const currentUserPhone = localStorage.getItem("phone");

        if (currentUserPhone === memberPhone) {
            this.services.toastrSevice.warning("you are inviting yourself!");
            return;
        }

        this.services.spinner.show();
        this.services.firebaseFunctions.invite(this.services.sharedData.groupId, this.services.sharedData.groupName,
            memberPhone)
            .then((response) => {
                this.services.spinner.hide();
                if (response.status === 200) {
                    if (response.text() === '0') {
                        this.services.toastrSevice.success("your invitation has been sent successfully");
                        if (modalRef) {
                            modalRef.close();
                        }
                    }
                    else if (response.text() === '1000') {
                        this.services.toastrSevice.error('phone number is not registered');
                    }
                    else if (response.text() === '2000') {
                        this.services.toastrSevice.warning('you have invited him before');
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                this.services.toastrSevice.error('error while sending your invitation');
                this.services.spinner.hide();
            });
    }
}