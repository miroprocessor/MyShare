"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const account = require("./account");
const groups = require("./groups");
const invitations = require("./invitations");
const expenses = require("./expenses");
exports.login = functions.https.onRequest((req, res) => {
    account.login(req, res);
});
exports.register = functions.https.onRequest((req, res) => {
    account.register(req, res);
});
exports.createGroup = functions.https.onRequest((req, res) => {
    groups.createGroup(req, res);
});
exports.userGroups = functions.https.onRequest((req, res) => {
    groups.userGroups(req, res);
});
exports.groupMembers = functions.https.onRequest((req, res) => {
    groups.groupMembers(req, res);
});
exports.isGroupAdmin = functions.https.onRequest((req, res) => {
    groups.isGroupAdmin(req, res);
});
exports.invite = functions.https.onRequest((req, res) => {
    invitations.invite(req, res);
});
exports.userInvitations = functions.https.onRequest((req, res) => {
    invitations.list(req, res);
});
exports.accept = functions.https.onRequest((req, res) => {
    invitations.accept(req, res);
});
exports.reject = functions.https.onRequest((req, res) => {
    invitations.reject(req, res);
});
exports.userExpenses = functions.https.onRequest((req, res) => {
    expenses.userExpenses(req, res);
});
exports.groupExpenses = functions.https.onRequest((req, res) => {
    expenses.groupExpenses(req, res);
});
exports.addExpenses = functions.https.onRequest((req, res) => {
    expenses.addExpenses(req, res);
});
exports.closeExpenses = functions.https.onRequest((req, res) => {
    expenses.closeExpenses(req, res);
});
//# sourceMappingURL=index.js.map