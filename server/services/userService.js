/**This service is used to manage all user functions.
 * Created by FantyG on 2017-02-11.
 */

let userService = {};

userService.sendRegistrationEmail = function (user, link, server) {
    server.app.mailer.send('registrationEmail', {
        to: user.email,
        subject: 'Account in CooLLections created!',
        host: server.host,
        link: link
    }, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Registration email sent.')
        }
    })
};

userService.create = function (user, connection, userTable, unactivatedUserTable, server, callback) {
    console.log("Creation of user.");
    let headers = [{name: 'Content-Type', value: 'application/json'}];
    this.checkNewUser(user, headers, userTable, callback, function (right) {
        if (right) {
            const hash = require('password-hash');
            user.password = hash.generate(user.password);
            userTable.create(user);
            userTable.sync().then(function () {
                userTable.findOne({where: {username: user.username}}).then(function (user) {
                    let unactivatedUser = {
                        userId: user.id
                    };
                    console.log('Generating link');
                    userService.generateActivationLink(unactivatedUserTable).then(function (link) {
                        unactivatedUser.activationLink = link;
                        unactivatedUserTable.create(unactivatedUser);
                        unactivatedUserTable.sync();
                        userService.sendRegistrationEmail(user, link, server);
                        let message = {message: 'user created'};
                        callback(JSON.stringify(message), headers, 200);
                    })
                })
            });
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

userService.generateActivationLink = function (unactivatedUserTable) {
    return new Promise(function (resolve) {
        const stringGenerator = require('randomstring');

        function checkLink() {
            let link = stringGenerator.generate(10);
            unactivatedUserTable.findOne({where: {activationLink: link}}).then(function (unactivatedUser) {
                if (!unactivatedUser) {
                    console.log('Created link: ' + link);
                    resolve(link);
                } else {
                    checkLink();
                }
            });
        }

        checkLink();
    });
};

userService.removeUnactivatedUsers = function (userTable, unactivatedUserTable) {
    return function () {
        unactivatedUserTable.findAll().then(function (unactivatedUsers) {
            let date = new Date();
            unactivatedUsers.forEach(function (unactivatedUser) {
                console.log('Checking for link ' + unactivatedUser.activationLink);
                //check if one day passed
                let diff = date.getTime() - unactivatedUser.createdAt.getTime();
                if (diff >= (1000 * 60 * 60 * 24)) {
                    unactivatedUserTable.destroy({where: {id: unactivatedUser.id}}).then(function () {
                        userTable.destroy({
                            where: {id: unactivatedUser.userId}
                        });
                    });
                }
            });
            //set timeout to one hour
            setTimeout(userService.removeUnactivatedUsers(userTable, unactivatedUserTable),
                1000 * 60 * 60);
        })
    }
};

userService.activateUser = function (body, unactivatedUserTable) {
    return new Promise(function (resolve) {
        let result = {};
        result.headers = [{name: 'Content-Type', value: 'application/json'}];
        if (!body.link) {
            result.message = JSON.stringify({message: 'link is required'});
            result.status = 401;
            resolve(result);
            return;
        }
        unactivatedUserTable.findOne({where: {activationLink: body.link}}).then(function (unactivatedUser) {
            if (!unactivatedUser) {
                result.message = JSON.stringify({message: 'wrong link'});
                result.status = 401;
                resolve(result);
                return;
            }
            unactivatedUserTable.destroy({where: {id: unactivatedUser.id}}).then( function () {
                result.message = JSON.stringify({message: 'account activated'});
                result.status = 200;
                resolve(result);
            }).catch(function (error) {
                console.log(error);
            });
        }).catch(function (error) {
            console.log(error);
        });
    });
};

module.exports = userService;