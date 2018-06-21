import { ServicesUnit } from "../../services/unit.services";

export class GroupDetailsModel {

    _groupId: string;
    _groupName: string;
    _bio: string;

    members: any[];
    showMembers: boolean = false;
    canInvite: boolean = false;

    constructor(private _services: ServicesUnit) {
        this._bio = _services.sharedData.groupBio;
        this._groupId = _services.sharedData.groupId;
        this._groupName = _services.sharedData.groupName;

        this.loadMembers();
    }

    loadMembers() {
        this._services.spinner.show();
        let that = this;
        this.members = new Array();
        this._services.firebaseFunctions.getGroupMembers(this._groupId)
            .then((data) => {
                this.members = data.json();
                this.members.forEach(member => {
                    if (member.id === localStorage.getItem('userId') && member.isAdmin) {
                        this.canInvite = true
                    }
                })
                if (this.members.length == 0) {
                    this._services.toastrSevice.warning('group with no memebers!!!');
                }
                this._services.spinner.hide();
                this.showMembers = true;
            })
            .catch((error) => {
                this._services.toastrSevice.error('error while loading group members');
                this._services.spinner.hide();
            })
    }

}