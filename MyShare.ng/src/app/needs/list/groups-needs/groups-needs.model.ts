import { ServicesUnit } from "../../../services/unit.services";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { INeed } from "../../../shared/interfaces";

export class GroupsNeedsModel {

    groups: any[];

    constructor(private services: ServicesUnit) {

        this.loadNeeds()
    }

    loadNeeds() {
        this.services.spinner.show();

        this.services.firebaseFunctions.getGroups(localStorage.getItem('id'))
            .then(_groups => {
                this.groups = _groups.json();
                this.groups.forEach(_group => {
                    //_group.needs = this.services.angularFirebaseService.groupNeeds(_group.id);
                    this.services.angularFirebaseService.groupNeeds(_group.id)
                        .pipe(
                            map(
                                actions => actions.map(_ => {
                                    return { 'id': _.payload.doc.id, ..._.payload.doc.data() }
                                }))
                        )
                        .subscribe(_ => {
                            _group.needs = [];
                            _.forEach(need => { _group.needs.push(need) });
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