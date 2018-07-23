import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';

admin.initializeApp();

import * as messaging from './messaging';

export const needsNotification = functions.firestore.document('/groups/{groupId}/needs/{needId}')
    .onCreate((snap, context): any => {
        return messaging.needsNotification(snap, context)
    });

export const invitationNotification = functions.firestore.document('/invitations/{groupId}')
    .onWrite((change, context): any => {
        return messaging.invitationNotification(change.before, change.after, context);
    });

export const newGroupMember = functions.firestore.document('members/{groupId}')
    .onWrite((change, context): any => {
        return messaging.newGroupMember(change.after, context);
    });

export const closing = functions.firestore.document('closures/{groupId}/closes/{closeId}')
    .onCreate((snapshot, context): any => {
        return messaging.closing(context);
    });

export const newExpenses = functions.firestore.document('expenditures/{groupId}/{userPhone}/{expensesId}')
    .onCreate((snapshot, context): any => {
        console.log('new expenses')
        return messaging.newExpenses(snapshot, context);
    });
