
import { Http, Headers, RequestOptions, ResponseContentType, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IExpenses } from '../shared/interfaces';


@Injectable()
export class FirebaseFunctions {

    private functionsUrl: string;
    private headers: Headers;
    private requestOptions: RequestOptions;

    constructor(private http: Http) {
        this.functionsUrl = environment.fireFunctionsUrl;
        this.headers = new Headers({ 'Content-Type': 'text/plain' });
        this.requestOptions = new RequestOptions({ headers: this.headers });
    }

    login(phone: string, password: string): Promise<Response> {
        return this.http.get(this.functionsUrl + 'login?phone=' + phone + '&pass=' + password).toPromise();
    }

    register(name: string, phone: string, password: string): Promise<Response> {
        return this.http
            .post(this.functionsUrl + 'register', { 'name': name, 'phone': phone, 'password': password }, this.requestOptions)
            .toPromise();
    }

    getGroups(userId: string): Promise<Response> {
        return this.http.get(this.functionsUrl + 'userGroups?uid=' + userId).toPromise();
    }

    getGroupMembers(groupId: string): Promise<Response> {
        return this.http.get(this.functionsUrl + 'groupMembers?gid=' + groupId).toPromise();
    }

    isGroupAdmin(groupId: string, userId: string) {
        return this.http.get(this.functionsUrl + 'isGroupAdmin?uid=' + userId + '&gid=' + groupId).toPromise();
    }

    invite(groupId: string, groupName: string, userPhone: string): Promise<Response> {
        const invitation = {
            'groupId': groupId,
            'groupName': groupName,
            'phone': userPhone
        }
        return this.http
            .post(this.functionsUrl + 'invite', invitation, this.requestOptions)
            .toPromise();
    }

    getInvitations(userId: string): Promise<Response> {
        return this.http.get(this.functionsUrl + 'userInvitations?uid=' + userId).toPromise();
    }

    acceptInvitation(invitationId: string, groupId: string, userId: string): Promise<Response> {
        const invitation = {
            'groupId': groupId,
            'userId': userId,
            'invitationId': invitationId
        }
        return this.http
            .post(this.functionsUrl + 'accept', invitation, this.requestOptions)
            .toPromise();
    }

    reject(invitationId: string): Promise<Response> {
        const invitation = {
            'invitationId': invitationId
        }
        return this.http
            .post(this.functionsUrl + 'reject', invitation, this.requestOptions)
            .toPromise();
    }

    addExpenses(expenses: IExpenses): Promise<Response> {
        return this.http
            .post(this.functionsUrl + 'addExpenses', expenses, this.requestOptions)
            .toPromise();
    }

    getUserExpenses(userId: string): Promise<Response> {
        return this.http.get(this.functionsUrl + 'userExpenses?uid=' + userId).toPromise();
    }

    getGroupExpenses(groupId: string): Promise<Response> {
        return this.http.get(this.functionsUrl + 'groupExpenses?gid=' + groupId).toPromise();
    }

    closeExpenses(close: any): Promise<Response> {
        return this.http
            .post(this.functionsUrl + 'closeExpenses', close, this.requestOptions)
            .toPromise();
    }
}