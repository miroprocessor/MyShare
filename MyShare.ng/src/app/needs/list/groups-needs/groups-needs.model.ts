import { ServicesUnit } from "../../../services/unit.services";
import { map } from "rxjs/operators";
import { IGroupNeeds } from "../../../shared/interfaces";

export class GroupsNeedsModel {

    groups: IGroupNeeds[];

    constructor(private services: ServicesUnit) {

        this.loadNeeds()
    }

    loadNeeds() {

        this.services.spinner.show();
        this.services.angularFirebaseService.getUserGroups(localStorage.getItem('id'))
            .subscribe(memberRefs => {
                this.groups = [];
                memberRefs.forEach(groupRef => {
                    const groupId = groupRef.payload.doc.id;
                    this.services.angularFirebaseService.getGroup(groupId)
                        .subscribe(_groupRef => {
                            const group: IGroupNeeds = {id:groupId, needs: [], ..._groupRef };
                            this.groups.push(group);
                            this.services.angularFirebaseService.getGroupNeeds(groupId)
                                .pipe(
                                    map(
                                        actions => actions.map(_ => {
                                            return { 'id': _.payload.doc.id, ..._.payload.doc.data() }
                                        }))
                                )
                                .subscribe(_ => {
                                    group.needs = [];
                                    _.forEach(need => { group.needs.push(need) });
                                });
                        });
                });
                this.services.spinner.hide();
            });
    }

    likeNeed(groupId: string, needId: string) {
        this.services.spinner.show();
        this.services.angularFirebaseService.likeNeed(groupId, needId)
            .then(_ => {
                this.services.spinner.hide();
            })
            .catch(error => {
                console.log(error)
                this.services.spinner.hide();
                if (error == 'FirebaseError: [code=unavailable]: Connection failed.') {
                    this.services.toastrSevice.error('can\'t vote while no internet connection');
                }
                else {
                    this.services.toastrSevice.error('can\'t like may be later');
                }
            });
    }

    deleteNeed(groupId: string, needId: string) {
        if (confirm('are you sure you no longer need this item?')) {
            this.services.spinner.show();
            this.services.angularFirebaseService.deleteNeed(groupId, needId)
                .then(_ => {
                    this.services.spinner.hide();
                })
                .catch(error => {
                    this.services.spinner.hide();
                    if (error == 'FirebaseError: [code=unavailable]: Connection failed.') {
                        this.services.toastrSevice.error('can\'t vote while no internet connection');
                    }
                    else {
                        this.services.toastrSevice.error('can\'t like may be later');
                    }
                });
        }
    }
}