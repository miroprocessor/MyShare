"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const db = admin.firestore();
exports.login = (request, response) => {
    response.setHeader('access-control-allow-origin', '*');
    const phone = request.query.phone;
    const password = request.query.pass;
    db.collection('users')
        .where('phone', '==', phone)
        .limit(1)
        .get()
        .then(snapshot => {
        if (snapshot.docs.length === 0) {
            response.status(404).send('wrong phone number or password.');
        }
        snapshot.forEach(doc => {
            if (doc.data().password === password) {
                response.status(200).send({ name: doc.data().name, id: doc.id });
            }
            else {
                response.status(404).send('wrong phone number or password.');
            }
        });
    })
        .catch(error => {
        console.log(error);
        response.status(500).send(error);
    });
};
exports.register = (request, response) => {
    response.setHeader('access-control-allow-origin', '*');
    const user = JSON.parse(request.body);
    db.collection('users')
        .where('phone', '==', user.phone)
        .limit(1)
        .get()
        .then(snapshot => {
        if (snapshot.docs.length > 0) {
            response.status(500).send('phone number is already regsitered.');
        }
        else {
            db.collection('users')
                .add(user)
                .then(newUser => {
                response.status(200).send({ id: newUser.id });
            })
                .catch(error => {
                response.status(500).send('Error while saving new user, try later');
            });
        }
    })
        .catch(error => {
        console.log(error);
        response.status(500).send('Error, try later');
    });
};
//# sourceMappingURL=account.js.map