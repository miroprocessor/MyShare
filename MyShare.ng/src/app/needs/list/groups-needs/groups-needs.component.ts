import { Component, OnInit } from '@angular/core';
import { ServicesUnit } from '../../../services/unit.services';
import { GroupsNeedsModel } from './groups-needs.model';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-groups-needs',
  templateUrl: './groups-needs.component.html',
  styleUrls: ['./groups-needs.component.css']
})
export class GroupsNeedsComponent implements OnInit {

  model: GroupsNeedsModel;

  constructor(private services: ServicesUnit, config: NgbAccordionConfig) {
    config.type = "dark";
    this.model = new GroupsNeedsModel(this.services);
  }

  ngOnInit() {
  }


  onAddNeeds() {
    this.services.route.navigate(['/needs/new-need']);[]
  }

  onLike(groupId: string, needId: string) {
    this.model.likeNeed(groupId, needId);
  }

  onDelete(groupId: string, needId: string) {
    this.model.deleteNeed(groupId, needId);
  }

}
