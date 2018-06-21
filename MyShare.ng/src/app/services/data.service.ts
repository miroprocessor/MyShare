import { Injectable } from "@angular/core";

@Injectable()
export class DataService {
  groupId: string = null;
  groupName: string = null;
  groupBio: string = null;
  isAdmin: boolean = false;

  reset() {
    this.groupId = null;
    this.groupBio = null;
    this.groupName = null;
    this.isAdmin = false;
  }

  set(_groupId: string, _groupName: string, _groupBio?: string) {
    this.groupId = _groupId;
    this.groupName = _groupName;
    this.groupBio = _groupBio;
  }
}
