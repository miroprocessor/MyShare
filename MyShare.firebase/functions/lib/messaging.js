"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const db = admin.firestore();
exports.needsNotification = (snap, context) => {
    const groupId = context.params.groupId;
    const needId = context.params.needId;
    const need = snap.data();
    console.log('new need', need);
    return db.doc('groups/' + groupId)
        .get()
        .then(groupRef => {
        const group = groupRef.data();
        const payload = {
            notification: {
                title: 'new need for group ' + group.name,
                body: need.quantity + ' ' + need.description,
                click_action: 'http://localhost:4200/needs'
            }
        };
        db.doc('members/' + groupId)
            .get()
            .then(memberRef => {
            const tokensPromises = [];
            for (let member in memberRef.data()) {
                const userId = member;
                if (need.userId != userId) { // don't notify sender
                    tokensPromises.push(db.doc('tokens/' + userId).get());
                }
            }
            return Promise.all(tokensPromises);
        })
            .then(tokensSnaps => {
            const tokens = [];
            console.log('tokensSnaps', tokensSnaps);
            tokensSnaps.forEach(tokenSnap => {
                tokens.push(tokenSnap.data().token);
            });
            console.log(tokens);
            return admin.messaging().sendToDevice(tokens, payload);
        });
    })
        .catch(error => {
        console.log(error);
    });
};
//# sourceMappingURL=messaging.js.map