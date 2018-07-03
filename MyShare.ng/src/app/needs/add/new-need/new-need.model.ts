import { ServicesUnit } from "../../../services/unit.services";
import { INeed } from "../../../shared/interfaces";

export class NewNeedModel {
    groups: any[];

    constructor(private services: ServicesUnit) {
        this.loadGroups();
    }

    loadGroups() {
        this.services.spinner.show();
        this.groups = [];
        this.services.firebaseFunctions.getGroups(localStorage.getItem('id'))
            .then((response) => {
                this.groups = response.json()
                this.services.spinner.hide();
            })
            .catch((error) => {
                console.log(error);
                this.services.spinner.hide();
            })
    }

    addNeed(groupId: string, need: INeed, callback: () => void) {
        []
        this.services.spinner.show();

        this.services.angularFirebaseService.addNeeds(groupId, need)
            .then(needRef => {
                this.services.spinner.hide();
                this.services.toastrSevice.success('your need is added to group needs successfully');
                callback();
            })
            .catch(error => {
                console.log('error',error);
                this.services.spinner.hide();
                this.services.toastrSevice.error('error while adding your need, try later');
            })
    }
}