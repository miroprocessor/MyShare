"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const db = admin.firestore();
exports.needsNotification = (snap, context) => {
    const groupId = context.params.groupId;
    const need = snap.data();
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
            for (const member in memberRef.data()) {
                const userId = member;
                if (need.userId !== userId) { // don't notify sender
                    tokensPromises.push(db.doc('tokens/' + userId).get());
                }
            }
            return Promise.all(tokensPromises);
        })
            .then(tokensSnaps => {
            const tokens = [];
            tokensSnaps.forEach(tokenSnap => {
                tokens.push(tokenSnap.data().token);
            });
            return admin.messaging().sendToDevice(tokens, payload);
        });
    })
        .catch(error => {
        console.log(error);
        return null;
    });
};
exports.invitationNotification = (beforeSnap, afterSnap, context) => {
    const groupId = context.params.groupId;
    const invitation = afterSnap.data();
    const phonesBefore = [];
    const phonesAfter = [];
    if (beforeSnap.data()) {
        for (const phone in beforeSnap.data()) {
            phonesBefore.push(phone);
        }
    }
    for (const phone in afterSnap.data()) {
        phonesAfter.push(phone);
    }
    const phonesToNotify = [];
    phonesAfter.forEach(phone => {
        if (phonesBefore.findIndex(item => item === phone) === -1 && invitation[phone] === true) {
            phonesToNotify.push(phone);
        }
    });
    if (phonesToNotify.length > 0) {
        let payload;
        return db.doc('groups/' + groupId)
            .get()
            .then(groupSnapShot => {
            const group = groupSnapShot.data();
            payload = {
                notification: {
                    title: 'new invitation',
                    body: 'you have been invited to join ' + group.name,
                    click_action: 'http://localhost:4200/invitations'
                }
            };
            const tokensPromises = [];
            for (const phone in invitation) {
                tokensPromises.push(db.doc('tokens/' + phone).get());
            }
            return Promise.all(tokensPromises);
        })
            .then(tokensSnaps => {
            const tokens = [];
            tokensSnaps.forEach(tokenSnap => {
                tokens.push(tokenSnap.data().token);
            });
            return admin.messaging().sendToDevice(tokens, payload);
        });
    }
    else {
        return null;
    }
};
exports.newGroupMember = (afterSnap, context) => {
    const groupId = context.params.groupId;
    const members = afterSnap.data();
    const phones = [];
    for (const phone in members) {
        phones.push(phone);
    }
    let payload;
    return db.doc('groups/' + groupId)
        .get()
        .then(groupRef => {
        const group = groupRef.data();
        payload = {
            notification: {
                title: 'new member',
                body: 'new member have joined group ' + group.name,
                click_action: 'http://localhost:4200/groups'
            }
        };
        const promises = [];
        phones.forEach(phone => {
            promises.push(db.doc('tokens/' + phone).get());
        });
        return Promise.all(promises);
    })
        .then(tokensRef => {
        const tokens = [];
        tokensRef.forEach(tokenRef => {
            tokens.push(tokenRef.data().token);
        });
        return admin.messaging().sendToDevice(tokens, payload);
    })
        .catch(error => {
        console.log(error);
        return null;
    });
};
exports.closing = (context) => {
    const groupId = context.params.groupId;
    return db.doc('groups/' + groupId)
        .get()
        .then(groupRef => {
        const group = groupRef.data();
        const payload = {
            notification: {
                title: 'new close',
                body: 'expenses of ' + group.name + ' are closed',
                click_action: 'http://localhost:4200/groups'
            }
        };
        db.doc('members/' + groupId)
            .get()
            .then(memberRef => {
            const tokensPromises = [];
            for (const member in memberRef.data()) {
                const userId = member;
                tokensPromises.push(db.doc('tokens/' + userId).get());
            }
            return Promise.all(tokensPromises);
        })
            .then(tokensSnaps => {
            const tokens = [];
            tokensSnaps.forEach(tokenSnap => {
                tokens.push(tokenSnap.data().token);
            });
            return admin.messaging().sendToDevice(tokens, payload);
        });
    })
        .catch(error => {
        console.log(error);
        return null;
    });
};
exports.newExpenses = (snap, context) => {
    const groupId = context.params.groupId;
    const userPhone = context.params.userPhone;
    const expenses = snap.data();
    return db.doc('groups/' + groupId)
        .get()
        .then(groupRef => {
        const group = groupRef.data();
        const payload = {
            notification: {
                title: 'new expenses is added for group ' + group.name,
                body: expenses.amount + ' for ' + expenses.details,
                click_action: 'http://localhost:4200/groups'
            }
        };
        db.doc('members/' + groupId)
            .get()
            .then(memberRef => {
            const tokensPromises = [];
            for (const member in memberRef.data()) {
                const userId = member;
                if (userPhone !== userId) { // don't notify sender
                    tokensPromises.push(db.doc('tokens/' + userId).get());
                }
            }
            return Promise.all(tokensPromises);
        })
            .then(tokensSnaps => {
            const tokens = [];
            tokensSnaps.forEach(tokenSnap => {
                tokens.push(tokenSnap.data().token);
            });
            return admin.messaging().sendToDevice(tokens, payload);
        });
    })
        .catch(error => {
        console.log(error);
        return null;
    });
};
//# sourceMappingURL=messaging.js.map