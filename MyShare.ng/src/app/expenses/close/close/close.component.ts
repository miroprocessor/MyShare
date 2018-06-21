import { Component, OnInit } from '@angular/core';
import { CloseModel } from './close.model';
import { ServicesUnit } from '../../../services/unit.services';

@Component({
  selector: 'app-close',
  templateUrl: './close.component.html',
  styleUrls: ['./close.component.css']
})
export class CloseComponent {

  model: CloseModel;

  constructor(public services: ServicesUnit) {
    if (services.sharedData.groupId === null) {
      services.route.navigate(['/expenses']);
    }
    else {
      this.model = new CloseModel(services);
    }
  }

  onClose() {
    if (confirm('are you sure you want to close the current expenses?')) {
      this.model.close();
    }
  }

}
