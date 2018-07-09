import { ServicesUnit } from "../../../services/unit.services";
import { INeed } from "../../../shared/interfaces";

export class NewNeedModel {
    groups: any[];

    constructor(private services: ServicesUnit) {
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