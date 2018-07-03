import { Component, OnInit } from '@angular/core';
import { GroupDetailsModel } from './group.model';
import { ServicesUnit } from '../../services/unit.services';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InviteModel } from '../../invitaions/invite/invite.model';


@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {

  model: GroupDetailsModel;
  inviteForm: FormGroup;

  inviteModel: InviteModel;
  modalRef: NgbModalRef;

  constructor(private services: ServicesUnit) {
    if (services.sharedData.groupId === null || services.sharedData.groupId === '') {
      this.services.route.navigate(['/groups']);
    }
    else {
      this.model = new GroupDetailsModel(this.services);
      this.inviteModel = new InviteModel(this.services);
    }
  }

  ngOnInit() {
    this.inviteForm = new FormGroup({
      txtPhone: new FormControl(null, Validators.required)
    });
  }

  onInvite() {
    const memberPhone = this.inviteForm.get("txtPhone").value;
    this.inviteModel.send(memberPhone, this.modalRef);
  }

  open(content) {
    this.modalRef = this.services.modalService.open(content, { centered: true });
    this.modalRef.result
      .then(_ => { }, reject => { });
  }
}
