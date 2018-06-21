import { ServicesUnit } from "../../services/unit.services";
import { IExpenses } from "../../shared/interfaces";

export class SpentModel {

    message: string;
    groups: any[];

    amount: number;
    details: string;

    constructor(private services: ServicesUnit) {
        this.loadGroups();
    }

    loadGroups() {
        this.services.spinner.show();
        this.groups = [];
        this.services.firebaseFunctions.getGroups(localStorage.getItem('userId'))
            .then((response) => {
                this.groups = response.json()
                this.services.spinner.hide();
            })
            .catch((error) => {
                console.log(error);
                this.services.spinner.hide();
            })
    }

    addExpenses(expenses: IExpenses, callback: () => void) {
        let that = this;
        this.services.spinner.show();
        this.services.firebaseFunctions.addExpenses(expenses)
            .then(function () {
                that.services.spinner.hide();
                that.message = 'your expenses is added successfully.'
                callback();
            })
            .catch(function () {
                that.services.spinner.hide();
                that.message = 'error when adding your expenses, try later.'
            });
    }
}