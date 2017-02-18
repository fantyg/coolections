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
                    unique: true,
                    allowNull: false
                },
                password: {
                    type: Sequelize.STRING,
                    field: 'password',
                    allowNull: false
                },
                name: {
                    type: Sequelize.STRING,
                    field: 'name',
                    allowNull: false
                },
                email: {
                    type: Sequelize.STRING,
                    field: 'email',
                    unique: true,
                    allowNull: false
                },
                role: {
                    type: Sequelize.STRING,
                    field: 'role',
                    unique: true,
                    allowNull: false,
                    defaultValue: 'user'
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
                },
                activationLink: {
                    type: Sequelize.STRING,
                    field: 'activation_link',
                    unique: true,
                    allowNull: false
                }
            }
        }
    ];
}

module.exports = models;