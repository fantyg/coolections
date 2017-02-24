/** File with routes.
 * Created by FantyG on 2017-02-18.
 */
let router = {};
router.userController = require('../controllers/userController');

router.init = function (server) {
    router.userController.init(server);
};

router.routes = [
    {
        route: '/rest/users',
        call: router.userController.postUser,
        method: 'POST'
    },
    {
        route: '/rest/users/activate',
        call: router.userController.activateUser,
        method: 'POST'
    },
    {
        route: '/rest/users/auth',
        call: router.userController.authenticateUser,
        method: 'POST'
    },
    {
        route: '/rest/users/:username',
        call: router.userController.getSpecificUser,
        method: 'GET'
    },
    {
        route: '/rest/users',
        call: router.userController.getAllUsers,
        method: 'GET'
    }
];

module.exports = router;