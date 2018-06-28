import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference, DocumentChangeAction } from "angularfire2/firestore";
import { INeed } from "../shared/interfaces";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AngularFirebaseService {

    constructor(private db: AngularFirestore) {
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

    likeNeed(groupId: string, needId: string):Promise<void> {
        // return this.db.doc('groups/' + groupId + '/needs/' + needId)
        //     .ref
        //     .get()
        //     .then(needDoc => {
        //         return this.db.doc('groups/' + groupId + '/needs/' + needId)
        //             .update({ 'votes': (needDoc.data().votes + 1) })
        //     });

        const needDoc = this.db.doc('groups/' + groupId + '/needs/' + needId).ref;

        return this.db.firestore.runTransaction(transaction => {
            return transaction.get(needDoc)
                .then(needRef => {
                    transaction.update(needDoc, { 'votes': needRef.data().votes + 1 });
                });
        });
    }
}