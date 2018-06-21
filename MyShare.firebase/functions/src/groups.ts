
import * as admin from "firebase-admin";

const db = admin.firestore();

export const createGroup = (request, response) => {
    response.setHeader('access-control-allow-origin', '*');

    const group = JSON.parse(request.body).group;
    const user = JSON.parse(request.body).member;

    db.collection('groups')
        .add(group)
        .then(groupRef => {
            const member = { 'groupId': groupRef.id, ...user };
            db.collection('members').add(member)
                .then(_ => {
                    response.status(200).send();
                })
                .catch(error => {
                    console.log(error);
                    response.status(500).send('error while adding you as a group member');
                });
        })
        .catch(error => {
            console.log(error);
            response.status(500).send('error while creating a new group');
        })
};

export const userGroups = (request, response) => {
    response.setHeader('access-control-allow-origin', '*');

    const userId = request.query.uid

    db.collection('members')
        .where('userId', '==', userId)
        .get()
        .then(membrs => {
            const promises = [];
            if (membrs.docs.length === 0) {
                console.log('no groups');
                response.status(200).send([])
            }
            else {
                membrs.docs.forEach(member => {
                    promises.push(db.collection('groups').doc(member.data().groupId).get());
                });
            }
            return Promise.all(promises);
        })
        .then(_groups => {
            const groupsArray = [];
            _groups.forEach(group => {
                    groupsArray.push({
                        'id': group.id,
                        'name': group.data().name,
                        'bio': group.data().bio
                    });
                });
            response.status(200).send(groupsArray);
        })
        .catch(error => {
            console.log(error);
            response.status(500).send(error);
        })
};

export const groupMembers = (request, response) => {
    response.setHeader('access-control-allow-origin', '*');
    const groupId = request.query.gid;

    const users = [];

    db.collection('members')
        .where('groupId', '==', groupId)
        .get()
        .then(members => {
            const usersRef = [];
            if (members.docs.length === 0) {
                console.log('no members');
                response.status(204).send([]);
            }
            else {
                members.forEach(member => {
                    users.push({
                        'id': member.data().userId,
                        'isAdmin': member.data().isAdmin,
                        'name': ''
                    })
                    usersRef.push(db.collection('users').doc(member.data().userId).get());
                });
            }
            return Promise.all(usersRef);
        })
        .then(usersRef => {
            usersRef.forEach(userRef => {
                users.forEach(user => {
                    if (userRef.id === user.id) {
                        user.name = userRef.data().name;
                    }
                });
            });
            response.status(200).send(users);
        })
        .catch(error => {
            console.log(error);
            response.status(500).send(error);
        })
};

export const isGroupAdmin = (request, response) => {
    response.setHeader('access-control-allow-origin', '*');
    const groupId = request.query.gid;
    const userId = request.query.uid;

    db.collection('members')
        .where('groupId', '==', groupId)
        .get()
        .then(members => {
            if (members.docs.length === 0) {
                console.log('no members');
                response.status(204).send([]);
            }
            else {
                members.forEach(member => {
                    if (member.data().userId === userId) {
                        response.status(200).send(member.data().isAdmin);
                    }
                });
            }
        })
        .catch(error => {
            console.log(error);
            response.status(500).send(error);
        })
};