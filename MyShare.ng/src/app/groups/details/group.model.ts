import { ServicesUnit } from "../../services/unit.services";
import { IUserFull } from "../../shared/interfaces";

export class GroupDetailsModel {

    _groupId: string;
    _groupName: string;
    _bio: string;

    members: IUserFull[];
    participantsCount: number;
    isAdmin: boolean = false;

    constructor(private services: ServicesUnit) {
        this._bio = services.sharedData.groupBio;
        this._groupId = services.sharedData.groupId;
        this._groupName = services.sharedData.groupName;

        this.loadMembers();
    }

    loadMembers() {
        this.members = [];
        this.services.spinner.show();

        this.services.angularFirebaseService.getGroup(this._groupId)
            .subscribe(group => {
                this.isAdmin = group.admin === localStorage.getItem('id');

                this._bio = group.bio;
                this.services.angularFirebaseService.getGroupMembers(this._groupId)
                    .subscribe(groupMembers => {
                        this.participantsCount = Object.keys(groupMembers).length;
                        this.members = []
                        for (var prop in groupMembers) {
                            this.services.spinner.show();
                            const userId = prop;
                            this.services.angularFirebaseService.getUser(userId)
                                .subscribe(_ => {
                                    const user = {
                                        id: userId,
                                        groupAdmin: userId === group.admin,
                                        ..._
                                    };
                                    this.members.push(user);
                                    this.services.spinner.hide();
                                });
                        }
                        this.services.spinner.hide();
                    },
                        () => {
                            this.services.toastrSevice.error('error while reading group details')
                            this.services.spinner.hide();
                        });

            });
    }

}