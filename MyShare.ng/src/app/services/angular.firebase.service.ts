import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference, DocumentChangeAction } from "angularfire2/firestore";
import { INeed, IUser, IGroup, IMember, IGroupMember } from "../shared/interfaces";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AngularFirebaseService {

    constructor(private db: AngularFirestore) {
    }

    register(phone: string, user: IUser): Promise<boolean> {
        return this.db.firestore.doc('users/' + phone)
            .get()
            .then(_ => {
                if (!_.exists) {
                    return this.db.collection<IUser>('users').doc(phone)
                        .set({
                            'name': user.name,
                            'password': user.password
                        })
                }
                else {
                    return Promise.reject(false);
                }
            })
            .then(() => {
                return true;
            })
            .catch((reason): boolean => {
                return false; // to stop continue in case of register new user
            });
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

    userGroups(userId: string): Promise<firebase.firestore.QuerySnapshot> {
        return this.db.collection('members').ref.where('' + userId + '', '==', true)
            .get();
    }

    getGroup(groupId: string): Observable<IGroup> {
        return this.db.doc<IGroup>('groups/' + groupId).valueChanges();
    }

    groupMembers(groupId: string): Observable<IGroupMember> {
        return this.db.doc<IGroupMember>('members/' + groupId).valueChanges();
    }

    addNeeds(groupId: string, need: INeed): Promise<DocumentReference> {
        return this.db.doc('groups/' + groupId)
            .collection<INeed>('needs')
            .add(need);
    }

    groupNeeds(groupId: string): Observable<DocumentChangeAction<INeed>[]> {
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

    invite(groupId: string, memberPhone: string): Promise<void> {
        return this.db.collection('invitations').doc(groupId)
            .set({ [memberPhone]: true });
    }

    // isGroupMember(groupId: string, phone: string): Observable<IGroupMember> {
    //     this.db.doc<IMember>('members/' + groupId)
    //         .valueChanges()
    //         .subscribe(phones => {
    //             for (var p in phones) {
    //                 if (p === phone) {
    //                     return true;
    //                 }
    //                 else {
    //                     return false;
    //                 }
    //             }
    //         });
    // }
}