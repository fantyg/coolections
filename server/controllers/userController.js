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

module.exports = userController;