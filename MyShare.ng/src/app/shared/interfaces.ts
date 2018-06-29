import { enums } from "./enums";

export interface IRegisterModel {
    name: string;
    phone: string;
    password: string;
}

export interface IGroupModel {
    name: string;
    bio: string;
    createdOn: Date;
}

export interface IMember {
    userId: string;
    isAdmin: boolean;
}

export interface GroupModel {
    id: string;
    name: string;
    bio: string;
    member: IMember;
}

export interface IInvitationModel {
    userId: string;
    groupId: string;
    groupName: string;
    status: enums.InvitationStatus;
}


export interface IExpenses {
    amount: number,
    details: string,
    userId: string,
    groupId: string,
    spentOn: Date
}

export interface INeed {
    quantity: number,
    description: string,
    votes: number
}

export interface IUser {
    name: string,
    password: string
}
