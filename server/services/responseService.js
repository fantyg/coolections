/**
 * Created by FantyG on 2017-02-20.
 */

let responseService = {};

responseService.response = function (res) {
    return function (message, headers, status) {
        console.log('status: ' + status);
        console.log('message: ' + message);
        console.log('headers: ' + headers.toString());
        headers = headers || [];
        if (typeof message !== 'string') {
            throw new TypeError('message must be string');
        }
        res.status(status);
        headers.forEach(function (header) {
            res.setHeader(header.name, header.value);
        });
        res.send(message);
    };
};

responseService.sendJsonRequired = function (res) {
    res.status(400);
    let error = {
        message: 'JSON is required to communicate with server.'
    };
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(error));
};

responseService.checkHeader = function (req) {
    return req.get('Content-Type') === 'application/json';
};

module.exports = responseService;