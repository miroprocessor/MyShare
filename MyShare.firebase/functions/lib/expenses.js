"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const db = admin.firestore();
exports.userExpenses = (request, response) => {
    response.setHeader('access-control-allow-origin', '*');
    const userId = request.query.uid;
    const openedExpenses = [];
    db.collection('expenses')
        .where('userId', '==', userId)
        .get()
        .then(expRefs => {
        const groupsRefs = [];
        if (expRefs.docs.length === 0) {
            response.status(200).send([]);
        }
        else {
            expRefs.forEach(expRef => {
                const expDetails = expRef.data();
                if (!expDetails.isClosed) {
                    openedExpenses.push({
                        'groupId': expDetails.groupId,
                        'amount': expDetails.amount,
                        'groupName': '',
                        'groupBio': '',
                        'spentOn': expDetails.spentOn,
                        'details': expDetails.details,
                        'isAdmin': false
                    });
                    groupsRefs.push(db.collection('groups').doc(expDetails.groupId).get());
                }
            });
        }
        return Promise.all(groupsRefs);
    })
        .then(groupsRefs => {
        const membersRefs = [];
        groupsRefs.forEach(group => {
            openedExpenses.forEach(expense => {
                if (expense.groupId === group.id) {
                    expense.groupName = group.data().name;
                    expense.groupBio = group.data().bio;
                }
            });
            membersRefs.push(db.collection('members')
                .where('groupId', '==', group.id)
                .get());
        });
        return Promise.all(membersRefs);
    })
        .then(membersRefs => {
        membersRefs.forEach(membersColl => {
            membersColl.docs.forEach(memberRef => {
                openedExpenses.forEach(expense => {
                    console.log(memberRef.data());
                    if (expense.groupId === memberRef.data().groupId && memberRef.data().isAdmin && memberRef.data().userId === userId) {
                        expense.isAdmin = true;
                    }
                });
            });
        });
        response.status(200).send(openedExpenses);
    })
        .catch(error => {
        console.log(error);
        response.status(500).send(error);
    });
};
exports.addExpenses = (request, response) => {
    response.setHeader('access-control-allow-origin', '*');
    const expense = JSON.parse(request.body);
    db.collection('expenses')
        .add(Object.assign({ 'isClosed': false }, expense))
        .then(_ => {
        response.send();
    })
        .catch(error => {
        console.log(error);
        response.status(500).send(error);
    });
};
exports.groupExpenses = (request, response) => {
    response.setHeader('access-control-allow-origin', '*');
    const groupId = request.query.gid;
    const _groupExpenses = [];
    db.collection('expenses')
        .where('groupId', '==', groupId)
        .get()
        .then(expensesRefs => {
        const membersRefs = [];
        if (expensesRefs.docs.length === 0) {
            response.status(200).send([]);
        }
        else {
            expensesRefs.forEach(expDetails => {
                if (!expDetails.data().isClosed) {
                    const data = expDetails.data();
                    _groupExpenses.push({
                        'amount': data.amount,
                        'userName': '',
                        'spentOn': data.spentOn,
                        'details': data.details,
                        'userId': data.userId,
                        'expenseId': expDetails.id
                    });
                    membersRefs.push(db.collection('users').doc(data.userId).get());
                }
            });
        }
        return Promise.all(membersRefs);
    })
        .then(membersRefs => {
        _groupExpenses.forEach(expenses => {
            membersRefs.forEach(user => {
                if (user.id === expenses.userId) {
                    expenses.userName = user.data().name;
                }
            });
        });
        response.status(200).send(_groupExpenses);
    })
        .catch(error => {
        console.log(error);
        response.status(500).send(error);
    });
};
exports.closeExpenses = (request, response) => {
    response.setHeader('access-control-allow-origin', '*');
    const reqBody = JSON.parse(request.body);
    console.log(reqBody);
    let closeId = null;
    db.collection('closes')
        .add({
        'groupId': reqBody.groupId,
        'totalAmount': reqBody.totalAmount,
        'closeDate': reqBody.closeDate
    })
        .then(closeRef => {
        closeId = closeRef.id;
        const promises = [];
        reqBody.expensesIds.forEach(expenseId => {
            const updateExp = db.collection('expenses')
                .doc(expenseId)
                .update({
                'isClosed': true,
                'closeId': closeId
            });
            promises.push(updateExp);
        });
        return Promise.all(promises);
    })
        .then(_ => {
        const promises = [];
        reqBody.balances.forEach(balance => {
            const addedBalance = db.collection('balances')
                .add(Object.assign({ 'closeId': closeId, 'groupId': reqBody.groupId, 'isPaid': false }, balance));
            promises.push(addedBalance);
        });
        return Promise.all(promises);
    })
        .then(_ => {
        response.status(200).send(true);
    })
        .catch(error => {
        console.log(error);
        response.status(500).send(error);
    });
};
//# sourceMappingURL=expenses.js.map