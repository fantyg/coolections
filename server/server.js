/**
 * Module with HTML routes and server methods.
 * Created by FantyG on 2017-02-09.
 */
let server = {port: 80};

server.getHomePage = function (req, res) {
    res.sendFile('D:/Coolections/server/home/home.html', null, function () {
        console.log('Home page sended.');
    })
};

server.getUserPage = function (req, res) {
    console.log('Get logged page.');
    console.log('Req: ');
    res.send('GET request to logged page.');
};

server.run = function () {
    console.log("server started");
};

server.start = function () {
    let express = require('express');
    let app = express();

    app.get('/', this.getHomePage);
    app.get('/login', this.getUserPage);
    app.listen(this.port, this.run);
};

module.exports = server;