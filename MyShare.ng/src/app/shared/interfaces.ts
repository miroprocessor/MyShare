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
    spentOn: Date,
    isClosed: boolean,
    name: string
}

export interface IExpensesFull {
    id: string,
    ref: string
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
    admin: string,
    totals: number,
    membersCount: number
}

export interface IGroupFull extends IGroup {
    id: string
}

export interface IGroupExpenses extends IGroupFull {
    expenses: IExpenses[]
}

export interface IGroupMember {
    member: IMember
}

export interface IMember {
    name: string,
    admin: boolean
}