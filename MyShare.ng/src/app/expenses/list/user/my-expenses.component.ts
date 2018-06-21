import { Component, OnInit } from '@angular/core';
import { ServicesUnit } from '../../../services/unit.services';
import { MyExpensesModel } from './my-expenses.model';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-my-expenses',
  templateUrl: './my-expenses.component.html',
  styleUrls: ['./my-expenses.component.css']
})
export class MyExpensesComponent implements OnInit {

  model: MyExpensesModel;

  constructor(private services: ServicesUnit,config: NgbAccordionConfig) {
    config.closeOthers = true;
    config.type = "dark";
    this.model = new MyExpensesModel(services);
  }

  ngOnInit() {
  }

  onAddExpenses() {
    this.services.route.navigate(['/expenses/spent'])
  }

  onClose(groupId: string, groupName: string, groupBio: string) {
    
    this.services.sharedData.set(groupId, groupName, groupBio);
    this.services.route.navigate(['/expenses/close']);
  }
}
