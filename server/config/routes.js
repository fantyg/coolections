/** File with routes.
 * Created by FantyG on 2017-02-18.
 */

let routes = function (server) {
    return [
        {
            route: '/rest/users',
            call: server.postUser,
            method: 'POST'
        },
        {
            route: '/rest/users/activate',
            call: server.activateUser,
            method: 'POST'
        }
    ];
};

module.exports = routes;