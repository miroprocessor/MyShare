import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference, DocumentChangeAction, DocumentSnapshot, Action } from "angularfire2/firestore";

import { INeed, IUser, IGroup, IGroupMember, IExpenses, IExpensesFull } from "../shared/interfaces";
import { Observable } from "rxjs";
import { firestore } from "firebase";
import * as firebase from "firebase";
import { FirebaseOptionsToken } from "../../../node_modules/angularfire2";

@Injectable({ providedIn: 'root' })
export class AngularFirebaseService {

    constructor(private db: AngularFirestore) {
    }


    addUser(user: IUser): Promise<void> {
        return this.db.collection<IUser>('users').doc(user.phone).set({ name: user.name })
    }

    login(phone: string, recaptchaVerifier: firebase.auth.ApplicationVerifier): Promise<firebase.auth.ConfirmationResult> {
        return firebase.auth().signInWithPhoneNumber(phone, recaptchaVerifier)
    }

    getUser(phone: string): Observable<IUser> {
        return this.db.doc<IUser>('users/' + phone)
            .valueChanges();
    }

    addGroup(group: IGroup): Promise<void> {
        return this.db.collection<IGroup>('groups')
            .add(group)
            .then(groupRef => {
                return this.db.doc('members/' + groupRef.id).set({ [group.admin]: true });
            });
    }

    getUserGroups(userId: string): Observable<DocumentChangeAction<{}>[]> {
        return this.db.collection('members',
            ref => ref.where('' + userId + '', '==', true))
            .snapshotChanges();
    }

    getGroup(groupId: string): Observable<IGroup> {
        return this.db.doc<IGroup>('groups/' + groupId).valueChanges();
    }

    getGroupMembers(groupId: string): Observable<IGroupMember> {
        return this.db.doc<IGroupMember>('members/' + groupId).valueChanges();
    }

    addNeeds(groupId: string, need: INeed): Promise<DocumentReference> {
        return this.db.doc('groups/' + groupId)
            .collection<INeed>('needs')
            .add(need);
    }

    getGroupNeeds(groupId: string): Observable<DocumentChangeAction<INeed>[]> {
        return this.db.doc('groups/' + groupId)
            .collection<INeed>('needs')
            .snapshotChanges()
    }

    likeNeed(groupId: string, needId: string): Promise<void> {
        const needDoc = this.db.doc('groups/' + groupId + '/needs/' + needId).ref;

        return this.db.firestore.runTransaction(transaction => {
            return transaction.get(needDoc)
                .then(needRef => {
                    transaction.update(needDoc, { 'votes': needRef.data().votes + 1 });
                });
        });
    }

    deleteNeed(groupId: string, needId: string): Promise<void> {
        return this.db.doc('groups/' + groupId + '/needs/' + needId)
            .ref
            .delete();
    }

    getInvitations(userId: string): Observable<DocumentChangeAction<{}>[]> {
        return this.db.collection('invitations',
            ref =>
                ref.where('' + userId + '', '==', true))
            .snapshotChanges();
    }

    sendInvitation(groupId: string, memberPhone: string): Promise<void> {
        return this.db.doc('invitations/' + groupId).ref.get().then(docRef => {
            if (docRef.exists) {
                return this.db.collection('invitations').doc(groupId)
                    .update({ [memberPhone]: true });
            }
            else {
                return this.db.collection('invitations').doc(groupId)
                    .set({ [memberPhone]: true });
            }
        })


    }

    getGroupInvitations(groupId: string): Observable<Action<DocumentSnapshot<{}>>> {
        return this.db.doc('invitations/' + groupId).snapshotChanges();
    }

    acceptInvitation(groupId: string, userId: string): Promise<void> {
        return this.db.doc('members/' + groupId)
            .update({ [userId]: true })
            .then(_ => {
                return this.db.doc('invitations/' + groupId)
                    .update({ [userId]: firestore.FieldValue.delete() })
                    .then(() => {
                        const groupDoc = this.db.doc('groups/' + groupId).ref;

                        return this.db.firestore.runTransaction(transaction => {
                            return transaction
                                .get(groupDoc)
                                .then(groupRef => {
                                    transaction.update(groupDoc, { 'membersCount': groupRef.data().membersCount + 1 });
                                });
                        });
                    });
            })
            .catch(() => {
                return Promise.reject(null)
            });
    }

    rejectInvitation(groupId: string, userId: string): Promise<void> {
        return this.db.doc('invitations/' + groupId)
            .update({ [userId]: false });
    }

    addExpenses(groupId: string, userId: string, expenses: IExpenses): Promise<void> {
        return this.db.collection<IExpenses>('expenditures/' + groupId + '/' + userId)
            .add(expenses)
            .then(() => {
                const groupDoc = this.db.doc('groups/' + groupId).ref;

                return this.db.firestore.runTransaction(transaction => {
                    return transaction
                        .get(groupDoc)
                        .then(groupRef => {
                            transaction.update(groupDoc, { 'totals': groupRef.data().totals + expenses.amount });
                        });
                });
            })
    }

    getUserExpenses(groupId: string, userId: string): Observable<DocumentChangeAction<IExpenses>[]> {
        return this.db.collection<IExpenses>('expenditures/' + groupId + '/' + userId,
            ref => ref.where('isClosed', '==', false))
            .snapshotChanges();
    }

    closeExpenses(groupId: string, totals: number, expenses: IExpensesFull[]): Promise<void> {
        const batch = this.db.firestore.batch();
        const closeId = this.db.createId();

        expenses.forEach(exp => {
            const expRef = this.db.doc('expenditures/' + groupId + '/' + exp.id + '/' + exp.ref).ref;
            batch.update(expRef, { isClosed: true, closeId: closeId });
        });
        const groupRef = this.db.doc('groups/' + groupId).ref;
        batch.update(groupRef, { totals: 0 });


        const closeRef = this.db.doc('closures/' + groupId + '/closes/' + closeId).ref;
        batch.set(closeRef, { totals: totals, closedOn: new Date() });
        return batch.commit();
    }

    updateMessagingToken(userId: string, token: string): Promise<void> {
        return this.db.collection('tokens').doc(userId)
            .set({ token: token });
    }
}