import { enums } from "./enums";

export interface IRegisterModel {
    name: string;
    phone: string;
    password: string;
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

export interface IUserFull extends IUser {
    id: string,
    groupAdmin: boolean
}

export interface IGroup {
    name: string,
    bio: string,
    admin: string
}
export interface IGroupFull extends IGroup {
    id: string
}

export interface IGroupMember {
    member: IMember
}

export interface IMember {
    name: string,
    admin: boolean
}