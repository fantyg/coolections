/**
 * Created by FantyG on 2017-02-16.
 */
let models = function(Sequelize) {
    return [
        {
            name: 'user',
            columns: {
                username: {
                    type: Sequelize.STRING,
                    field: 'username'
                },
                password: {
                    type: Sequelize.STRING,
                    field: 'password'
                },
                name: {
                    type: Sequelize.STRING,
                    field: 'name'
                },
                email: {
                    type: Sequelize.STRING,
                    field: 'email'
                }
            }
        }
    ];
}

module.exports = models;