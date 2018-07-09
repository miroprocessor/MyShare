import { ServicesUnit } from "../../services/unit.services";
import { IExpenses } from "../../shared/interfaces";

export class SpentModel {

    groups: any[];

    amount: number;
    details: string;

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

    addExpenses(groupId: string, expenses: IExpenses, callback: () => void) {
        this.services.spinner.show();
        this.services.angularFirebaseService.addExpenses(groupId, localStorage.getItem('id'), expenses)
            .then(() => {
                this.services.spinner.hide();
                this.services.toastrSevice.success('your expenses is added successfully.');
                callback();
            })
            .catch((error) => {
                console.log(error)
                this.services.spinner.hide();
                this.services.toastrSevice.error('error when adding your expenses, try later.');
            });
    }
}