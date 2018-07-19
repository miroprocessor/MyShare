import { Component, OnInit } from '@angular/core';
import { NewNeedModel } from './new-need.model';
import { ServicesUnit } from '../../../services/unit.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { INeed } from '../../../shared/interfaces';

@Component({
  selector: 'app-new-need',
  templateUrl: './new-need.component.html',
  styleUrls: ['./new-need.component.css']
})
export class NewNeedComponent implements OnInit {

  model: NewNeedModel;
  needsForm: FormGroup;

  constructor(private services: ServicesUnit) {
    this.model = new NewNeedModel(this.services);
  }

  ngOnInit() {
    this.needsForm = new FormGroup({
      'txtQuantity': new FormControl(null, Validators.required),
      'txtDescription': new FormControl(null, Validators.required),
      'ddlGroups': new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    const need: INeed = {
      description: this.needsForm.get("txtDescription").value,
      quantity: this.needsForm.get("txtQuantity").value,
      votes: 1,
      userId:localStorage.getItem('id')
    }
    this.model.addNeed(this.needsForm.get("ddlGroups").value, need, () => {
      this.needsForm.reset();
    });
  }

  onCancel() {
    this.services.route.navigate(['/needs']);
  }

}
