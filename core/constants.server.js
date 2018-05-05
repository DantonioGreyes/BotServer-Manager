'use strict';
let HOST = 'localhost';
let HTTP_PORT = 8080;
module.exports = Object.freeze({
    MONGODB_URL_CONNECTION: 'mongodb://testdb:j9jjk8k9@ds113648.mlab.com:13648/testingdb',
    PORT_SERVER : process.env.PORT || HTTP_PORT,
    WS_PORT : 40210,
    APP_NAME : 'BotServer Manager (V.2.0)',
    PATH_TEMP: './logs/log_tmp.log',
    CRUD_CREATE : 'http://'+HOST+':'+HTTP_PORT+'/api/create/',
    CONTENT_TYPE_JSON : {'Content-Type': 'application/json'},
    CONTENT_TYPE_URLENCODED :  {'content-type': 'application/x-www-form-urlencoded'},
});
