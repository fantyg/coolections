/**
 * Created by FantyG on 2017-02-20.
 */

let userController = {};

userController.init = function (server) {
    userController.server = server;
};

userController.userService = require('../services/userService');

userController.responseService = require('../services/responseService');

userController.postUser = function (req, res) {
    if (!userController.responseService.checkHeader(req)) {
        userController.responseService.sendJsonRequired(res);
        return;
    }
    userController.userService.create(req.body, userController.server.connection, userController.server.tables.user,
        userController.server.tables.unactivatedUser, userController.server,
        userController.responseService.response(res));
};

userController.activateUser = function (req, res) {
    if (!userController.responseService.checkHeader(req)) {
        userController.responseService.sendJsonRequired(res);
        return;
    }
    userController.userService.activateUser(req.body, userController.server.tables.unactivatedUser)
        .then(function (result) {
            userController.responseService.response(res)(result.message, result.headers, result.status);
        }).catch(function (error) {
        console.log(error);
    });
};

userController.authenticateUser = function (req, res) {
    if (!userController.responseService.checkHeader(req)) {
        userController.responseService.sendJsonRequired(res);
        return;
    }
    let sess = req.session;
    userController.userService.authenticateUser(req.body, sess, userController.server.tables.user,
        userController.server.tables.unactivatedUser)
        .then(function (result) {
            userController.responseService.response(res)(result.message, result.headers, result.status);
        }).catch(function (err) {
        console.error(err);
    })
};

userController.checkRole = function (role, username, reqUsername) {
    if (!role || !username) {
        return 'none';
    }
    if (username === reqUsername) {
        return 'owner';
    }
    return role;
};

userController.getSpecificUser = function (req, res) {
    if (!req.params.username) {
        let message = {message: "username required"};
        let headers = [{name: 'Content-Type', value: 'application/json'}];
        userController.responseService.response(res)(JSON.stringify(message), headers, 400);
        return;
    }
    let sess = req.session;
    let role = userController.checkRole(sess.role, sess.username, req.params.username);
    userController.userService.getSpecificUser(req.params.username, userController.server.tables.user, role).then(
        function (result) {
            userController.responseService.response(res)(result.message, result.headers, result.status);
        }
    ).catch(function (error) {
        console.error(error);
    });
};

userController.getAllUsers = function (req, res) {
    let witch = req.query.witch || 'all';
    let sess = req.session;
    let role = userController.checkRole(sess.role, sess.username);
    userController.userService.getAllUsers(witch, userController.server.tables.user, role)
        .then(function (result) {
            userController.responseService.response(res)(result.message, result.headers, result.status);
        }).catch(function (error) {
            console.error(error);
    })
};

module.exports = userController;