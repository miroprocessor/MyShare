import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';

admin.initializeApp();

// import * as account from './account';
// import * as groups from './groups';
// import * as invitations from './invitations';
// import * as expenses from './expenses';
import * as messaging from './messaging';

// export const login = functions.https.onRequest((req, res) => {
//     account.login(req, res);
// });

// export const register = functions.https.onRequest((req, res) => {
//     account.register(req, res);
// });

// export const createGroup = functions.https.onRequest((req, res) => {
//     groups.createGroup(req, res);
// });

// export const userGroups = functions.https.onRequest((req, res) => {
//     groups.userGroups(req, res);
// });

// export const groupMembers = functions.https.onRequest((req, res) => {
//     groups.groupMembers(req, res);
// });

// export const isGroupAdmin = functions.https.onRequest((req, res) => {
//     groups.isGroupAdmin(req, res);
// });

// export const invite = functions.https.onRequest((req, res) => {
//     invitations.invite(req, res);
// });

// export const userInvitations = functions.https.onRequest((req, res) => {
//     invitations.list(req, res);
// });

// export const accept = functions.https.onRequest((req, res) => {
//     invitations.accept(req, res);
// });

// export const reject = functions.https.onRequest((req, res) => {
//     invitations.reject(req, res);
// });

// export const userExpenses = functions.https.onRequest((req, res) => {
//     expenses.userExpenses(req, res);
// });

// export const groupExpenses = functions.https.onRequest((req, res) => {
//     expenses.groupExpenses(req, res);
// });

// export const addExpenses = functions.https.onRequest((req, res) => {
//     expenses.addExpenses(req, res);
// });

// export const closeExpenses = functions.https.onRequest((req, res) => {
//     expenses.closeExpenses(req, res);
// });


export const needsNotification = functions.firestore.document('/groups/{groupId}/needs/{needId}')
    .onCreate((snap, context): any => {
        return messaging.needsNotification(snap, context)
    });
