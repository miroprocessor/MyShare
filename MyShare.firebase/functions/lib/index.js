"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const messaging = require("./messaging");
exports.needsNotification = functions.firestore.document('/groups/{groupId}/needs/{needId}')
    .onCreate((snap, context) => {
    return messaging.needsNotification(snap, context);
});
exports.invitationNotification = functions.firestore.document('/invitations/{groupId}')
    .onWrite((change, context) => {
    return messaging.invitationNotification(change.before, change.after, context);
});
exports.newGroupMember = functions.firestore.document('members/{groupId}')
    .onWrite((change, context) => {
    return messaging.newGroupMember(change.after, context);
});
exports.closing = functions.firestore.document('closures/{groupId}/closes/{closeId}')
    .onCreate((snapshot, context) => {
    return messaging.closing(context);
});
//# sourceMappingURL=index.js.map