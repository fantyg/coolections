/**This service is used to manage all user functions.
 * Created by FantyG on 2017-02-11.
 */

var userService = {};

userService.create = function (user, connection, table, callback) {
    console.log("Creation of user.");
    let headers = [{name: 'Content-Type', value: 'application/json'}];
    this.checkNewUser(user, headers, table, callback, function (right) {
        if (right) {
            table.create(user);
            let message = {message: 'user created'};
            table.sync();
            callback(JSON.stringify(message), headers, 200);
        }
    });
};

userService.usernameExists = function (username, table, callback) {
    table.findOne({where: {username: username}}).then(function (user) {
        console.log('checked username!');
        callback(user !== null);
    });
};

userService.emailExists = function (email, table, callback) {
    table.findOne({where: {email: email}}).then(function (user) {
        console.log('checked email!');
        callback(user !== null);
    });
};

userService.checkNewUser = function (user, headers, table, send, callback) {
    let requirements = ['username', 'password', 'name', 'email'],
        validRequirements = true;
    requirements.forEach(function (requirement) {
        if (!validRequirements) {
            return;
        }
        if (typeof user[requirement] === 'undefined') {
            let message = {message: requirement + ' is required'};
            send(JSON.stringify(message), headers, 401);
            validRequirements = false;
            callback(false);
            return;
        }
        if (user[requirement] === '') {
            let message = {message: requirement + ' cannot be empty'};
            send(JSON.stringify(message), headers, 401);
            validRequirements = false;
            callback(false);
        }
    });
    if (validRequirements) {
        userService.usernameExists(user.username, table, function (exists) {
            if (exists) {
                let message = {message: 'user with this username already exists'};
                send(JSON.stringify(message), headers, 401);
                callback(false);
                return
            }
            userService.emailExists(user.email, table, function (exists) {
                if (exists) {
                    let message = {message: 'user with this email already exists'};
                    send(JSON.stringify(message), headers, 401);
                    callback(false);
                    return;
                }
                callback(true);
            });
        });
    }
};

module.exports = userService;