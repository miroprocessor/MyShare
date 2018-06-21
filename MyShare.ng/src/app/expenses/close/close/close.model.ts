import { ServicesUnit } from "../../../services/unit.services";

export class CloseModel {

    expenses: any = []

    total: number = 0.0;
    dueAmount: number = 0.0;
    balances: any = [];
    members: any = [];
    isAdmin: boolean = false;

    constructor(private services: ServicesUnit) {
        this.loadExpenses()
            .then(promises => {

                this.services.spinner.hide();
                this.expenses = promises[0].json();
                this.members = promises[1].json();

                this.isAdmin = this.members.find(_ => _.id === localStorage.getItem('userId') && _.isAdmin) ? true : false;

                this.expenses.forEach(exp => {
                    exp.spentOn = new Date(exp.spentOn).toLocaleString();
                    this.total += exp.amount;
                });
                if (this.members.length > 0) {
                    this.dueAmount = this.total / this.members.length;
                    this.members.forEach(member => {
                        const m_balances = this.expenses.filter(_ => _.userId === member.id);
                        const _paidAmount = (m_balances.map(_ => _.amount).reduce((acc, cur) => acc + cur)).toFixed(3);

                        this.balances.push({
                            'name': member.name,
                            'userId': member.id,
                            'dueAmount': this.dueAmount,
                            'paidAmount': _paidAmount,
                            'amount': (_paidAmount - this.dueAmount).toFixed(3),
                            'closingDate': new Date()
                        });
                    });
                }
            })
            .catch(error => {
                console.log(error);
                this.services.spinner.hide();
            });
    }

    loadExpenses(): Promise<any> {
        this.services.spinner.show();
        const promises = [];
        promises.push(this.services.firebaseFunctions.getGroupExpenses(this.services.sharedData.groupId));

        promises.push(this.services.firebaseFunctions.getGroupMembers(this.services.sharedData.groupId));

        return Promise.all(promises);
    }

    close() {
        this.services.spinner.show();

        const expensesIds = this.expenses.map(_ => _.expenseId);

        const close = {
            'groupId': this.services.sharedData.groupId,
            'totalAmount': this.total,
            'expensesIds': expensesIds,
            'balances': this.balances,
            'closeDate': new Date()
        }

        this.services.firebaseFunctions.closeExpenses(close)
            .then(_ => {
                this.services.spinner.hide();
                this.services.route.navigate(['/expenses'])
                this.services.toastrSevice.success('opened expeneses are closed succeffully');
            })
            .catch(error => {
                this.services.spinner.hide();
                this.services.toastrSevice.error('error : not closed');
                console.log(error);
            });
    }
}