
import * as admin from 'firebase-admin'

const db = admin.firestore();

export const invite = (request, response) => {
    response.setHeader('access-control-allow-origin', '*');

    const invitation = JSON.parse(request.body);
    db.collection('users')
        .where('phone', '==', invitation.phone)
        .get()
        .then(userRef => {
            if (userRef.docs.length === 0) {
                response.status(200).send('1000'); // phone number is not registered
            }
            else {
                const user = userRef.docs[0];
                db.collection('invitations')
                    .where('userId', '==', user.id)
                    .get()
                    .then(invsRef => {
                        if (invsRef.docs.filter((element, index, array) => {
                            return element.data().userId === user.id && element.data().groupId === invitation.groupId;
                        }).length > 0) {
                            response.status(200).send('2000'); // user has been invited before.
                        }
                        else {
                            db.collection('invitations')
                                .add({
                                    'groupId': invitation.groupId,
                                    'groupName': invitation.groupName,
                                    'userId': user.id,
                                    'status': 'new'
                                })
                                .then(_ => {
                                    response.status(200).send('0');
                                })
                                .catch(error => {
                                    console.error(error);
                                    response.status(500).send('error');
                                })
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        response.status(500).send('error');
                    })
            }
        })
        .catch(error => {
            console.error(error);
            response.status(500).send('error');
        })
};

export const list = (request, response) => {
    response.setHeader('access-control-allow-origin', '*')

    const userId = request.query.uid;

    db.collection('invitations')
        .where('userId', '==', userId)
        .get()
        .then(invsRef => {
            if (invsRef.docs.length === 0) {
                response.status(200).send([]);
            }
            else {
                const invitationsArr = [];
                invsRef.docs.forEach(invt => {
                    if (invt.data().status === 'new') {
                        const invitation = {
                            id: invt.id,
                            groupName: invt.data().groupName,
                            groupId: invt.data().groupId,
                            status: invt.data().status
                        };
                        invitationsArr.push(invitation);
                    }
                });
                response.status(200).send(invitationsArr);
            }
        })
        .catch(error => {
            console.log(error);
            response.status(500).send('error');
        });
};

export const accept = (request, response) => {
    response.setHeader('access-control-allow-origin', '*');

    const acceptance = JSON.parse(request.body);

    db.collection('members')
        .add({
            'groupId': acceptance.groupId,
            'userId': acceptance.userId,
            'isAdmin': false
        })
        .then(_ => {
            return db.collection('invitations').doc(acceptance.invitationId).update({ 'status': 'accepted' })
        })
        .then(_ => {
            response.status(200).send();
        })
        .catch(error => {
            console.log(error);
            response.status(500).send(error);
        })
};

export const reject = (request, response) => {
    response.setHeader('access-control-allow-origin', '*');

    const rejection = JSON.parse(request.body);

    db.collection('invitations').doc(rejection.invitationId)
        .update({ 'status': 'rejected' })
        .then(_ => {
            response.status(200).send();
        })
        .catch(error => {
            console.log(error);
            response.status(500).send(error);
        });
};