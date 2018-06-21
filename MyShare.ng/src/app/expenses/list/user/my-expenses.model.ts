import { ServicesUnit } from "../../../services/unit.services";

export class MyExpensesModel {
    groups: any[];
    constructor(private services: ServicesUnit) {
        this.loadExpenses();
    }

    loadExpenses() {
        this.services.spinner.show();
        this.groups = [];
        this.services.firebaseFunctions.getUserExpenses(localStorage.getItem('userId'))
            .then((response) => {
                response.json().forEach(element => {
                    const group = this.groups.find(_group => _group.id === element.groupId);
                    element.spentOn = new Date(element.spentOn).toLocaleString();
                    if (group) {
                        group.expenses.push(element);
                    }
                    else {
                        this.groups.push({
                            'id': element.groupId,
                            'name': element.groupName,
                            'isAdmin': element.isAdmin,
                            'bio': element.groupBio,
                            expenses: [element]
                        });
                    }
                });
                this.services.spinner.hide();
            })
            .catch((error) => {
                this.services.spinner.hide();
                this.services.toastrSevice.error('could NOT get your expenses, try later');
            })
    }
}