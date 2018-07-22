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
    