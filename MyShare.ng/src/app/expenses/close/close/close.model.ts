import { ServicesUnit } from "../../../services/unit.services";
import { IGroup, IGroupMember, IExpensesFull } from "../../../shared/interfaces";
import { Observable } from "rxjs/Observable";

export class CloseModel {

    expenses: IExpensesFull[];

    total: number = 0.0;
    dueAmount: number = 0.0;
    balances: any = [];
    members: IGroupMember;
    userId: string;

    group: Observable<IGroup>;

    constructor(private services: ServicesUnit) {
        this.userId = localStorage.getItem('id');
        this.group = this.services.angularFirebaseService.getGroup(this.services.sharedData.groupId)

        this.loadExpenses();
    }

    loadExpenses() {
        this.services.spinner.show();
        const groupId = this.services.sharedData.groupId;

        this.group.subscribe(g => {
            this.services.angularFirebaseService.getGroupMembers(groupId)
                .subscribe(members => {

                    this.dueAmount = g.totals / g.membersCount;
                    this.total = g.totals;
                    this.balances = [];
                    for (var mem in members) {
                        this.expenses = [];
                        this.services.spinner.show();
                        const phone = mem;
                        this.services.angularFirebaseService.getUserExpenses(groupId, phone)
                            .subscribe(userExp => {
                                if (userExp.length === 0) {
                                    this.services.angularFirebaseService.getUser(phone)
                                        .subscribe(user => {
                                            this.balances.push({
                                                id: phone,
                                                name: user.name,
                                                amount: -this.dueAmount
                                            })
                                        })
                                }

                                const userExpeneses = [];
                                userExp.forEach(exp => {
                                    const item = { id: phone, ref: exp.payload.doc.id, ...exp.payload.doc.data() }

                                    if (this.expenses.findIndex(x => x.ref === item.ref) === -1) {
                                        this.expenses.push(item);
                                        userExpeneses.push(item);
                                    }
                                });
                                userExpeneses.forEach(item => {
                                    const index = this.balances.findIndex(x => x.id === item.id)
                                    if (index > -1) {
                                        this.balances[index].amount += item.amount;
                                    }
                                    else {
                                        this.balances.push({
                                            id: item.id,
                                            name: item.name,
                                            amount: item.amount - this.dueAmount
                                        })
                                    }
                                });
                                this.services.spinner.hide();
                            });
                    }

                    this.services.spinner.hide();
                });

        });
    }
    close() {
        this.services.spinner.show();

        this.services.angularFirebaseService.closeExpenses(this.services.sharedData.groupId, this.total, this.expenses)
            .then(() => {
                this.services.spinner.hide();
                this.services.toastrSevice.success('closing process completed successfully');
            })
            .catch(() => {
                this.services.spinner.hide();
                this.services.toastrSevice.error('Error : closing process not completed');
            })
    }
}