import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServicesUnit } from '../../services/unit.services';
import { SpentModel } from './spent.model';
import { IExpenses } from '../../shared/interfaces';

@Component({
  selector: 'app-spent',
  templateUrl: './spent.component.html',
  styleUrls: ['./spent.component.css']
})
export class SpentComponent implements OnInit {

  expensesForm: FormGroup;
  model: SpentModel;

  constructor(private services: ServicesUnit) {
    this.model = new SpentModel(services);
  }

  ngOnInit() {
    this.expensesForm = new FormGroup({
      'txtAmount': new FormControl(null, Validators.required),
      'txtDetails': new FormControl(null, Validators.required),
      'ddlGroups': new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    let expenses: IExpenses = {
      amount: this.expensesForm.get('txtAmount').value,
      details: this.expensesForm.get('txtDetails').value,
      spentOn: new Date(),
      isClosed: false,
      name: localStorage.getItem('name')
    };
    this.model.addExpenses(this.expensesForm.get('ddlGroups').value, expenses, () => {
      this.expensesForm.reset();
    });
  }

  onCancel() {
    this.services.route.navigate(['/expenses']);
  }

}
