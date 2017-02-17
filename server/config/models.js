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
                    field: 'username',
                    unique: true
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
                    field: 'email',
                    unique: true
                }
            }
        },
        {
            name: 'unactivatedUser',
            columns: {
                userId: {
                    type: Sequelize.INTEGER,
                    field: 'user_id',
                    unique: true,
                    references: {
                        model: 'user',
                        key: 'id',
                        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
                    }
                }
            }
        }
    ];
}

module.exports = models;