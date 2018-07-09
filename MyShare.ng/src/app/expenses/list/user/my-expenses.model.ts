import { ServicesUnit } from "../../../services/unit.services";
import { IGroupExpenses, IExpenses } from "../../../shared/interfaces";

export class MyExpensesModel {
    groups: IGroupExpenses[];

    noExpenses: boolean = false;

    userId = localStorage.getItem('id');

    constructor(private services: ServicesUnit) {
        this.loadExpenses();
    }

    loadExpenses() {

        this.services.angularFirebaseService.getUserGroups(this.userId)
        .subscribe(memberRefs => {
            this.noExpenses = memberRefs.length === 0;
            this.groups = [];
            memberRefs.forEach(groupRef => {
                const groupId = groupRef.payload.doc.id;
                this.services.angularFirebaseService.getGroup(groupId)
                    .subscribe(groupDoc => {
                        const group: IGroupExpenses = { id: groupId, expenses: [], ...groupDoc };
                        // get expenses
                        this.services.angularFirebaseService.getUserExpenses(groupId, this.userId)
                            .subscribe(expRefs => {
                                group.expenses = [];
                                expRefs.forEach(expRef => {
                                    const exp = expRef.payload.doc.data();
                                    group.expenses.push(exp);
                                });

                                const index = this.groups.findIndex(x => x.id === groupId)
                                if (index > -1) {
                                    this.groups[index] = group;
                                }
                                else {
                                    this.groups.push(group);
                                }
                            });
                    });
            });
            this.services.spinner.hide();
        });
    }
}