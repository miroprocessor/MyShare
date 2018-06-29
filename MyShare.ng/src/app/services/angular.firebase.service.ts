import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference, DocumentChangeAction } from "angularfire2/firestore";
import { INeed, IUser } from "../shared/interfaces";
import { Observable, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AngularFirebaseService {

    constructor(private db: AngularFirestore) {
    }


    userExists(phone: string): Promise<boolean> {
        return this.db.firestore.doc('users/' + phone)
            .get()
            .then(_ => {
                return _.exists;
            })
            .catch(_ => {
                return true; // to stop continue in case of register new user
            })
    }

    register(phone: string, user: IUser): Promise<boolean | void> {
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

    login(phone: string, password: string): Promise<boolean> {
        return this.db.firestore.doc('users/'+phone)
            .get()
            .then(_ => {
                if (!_.exists) {
                    return Promise.reject(false);
                }
                else {
                    if (_.data().password !== password) {
                        return Promise.reject(false);
                    }
                    else {
                        return Promise.resolve(true);
                    }
                }
            })
            .then(_ => {
                return true;
            })
            .catch((reason): boolean => {
                return false;
            })
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
}