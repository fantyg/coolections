/**
 * Created by FantyG on 2017-02-09.
 */

var express = require('express');
var app = express();

function getHome(req, res) {
    res.send('GET request to homepage.')
}
function run() {
    console.log("server started");
}

app.get('/', getHome);
app.listen(3000, run);