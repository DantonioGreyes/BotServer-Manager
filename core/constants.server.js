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
    CRUD_READ : 'http://'+HOST+':'+HTTP_PORT+'/api/read/',
    CRUD_UPDATE : 'http://'+HOST+':'+HTTP_PORT+'/api/update/',
    CRUD_DELETE : 'http://'+HOST+':'+HTTP_PORT+'/api/delete/',
    CONTENT_TYPE_JSON : {'Content-Type': 'application/json'},
    CONTENT_TYPE_URLENCODED :  {'content-type': 'application/x-www-form-urlencoded'},
    PATH_BOT: botName => './services/' + botName + '/controller.js',
    GITHUB_CLIENT_ID : 'fdf7ce87177c51afedd8',
    GITHUB_CLIENT_SECRET : '809985ce5bd614b92d6f0af761ccc97803b5862c',
    GITHUB_URL_ACCESS: 'https://github.com/login/oauth/access_token',
    GITHUB_URL_USER: 'https://api.github.com/user',
    HELP_COMMANDS_DETAILS : '' +
'execute payspan\n' +
    'execute payspan multiple\n' +
    'execute payspan auditor\n' +
    'execute payspan validator\n' +
    '\n' +
    '.......................\n' +
    '\n' +
    'execute optum \n' +
    'execute optum auditor\n' +
    'execute optum validator\n' +
    '\n' +
    '.......................\n' +
    '\n' +
    'execute medictouch (once only)\n' +
    'execute medictouch auto\n' +
    'execute medictouch validator\n' +
    '\n' +
    '.......................\n' +
    '\n' +
    'credentials payspan\n' +
    'credentials optum\n' +
    'credentials medictouch\n' +
    'credentials user\n' +
    '\n' +
    '.......................\n' +
    '\n' +
    'getLogs payspan anyday\n' +
    'getLogs payspan currentday\n' +
    'getLogs payspan yesterday \n' +
    '\n' +
    'getLogs optum anyday\n' +
    'getLogs optum currentday\n' +
    'getLogs optum yesterday \n' +
    '\n' +
    'getLogs medictouch anyday\n' +
    'getLogs medictouch currentday\n' +
    'getLogs medictouch yesterday \n' +
    '\n' +
    '.......................\n' +
    '\n' +
    'getData payspan anyday\n' +
    'getData payspan currentday\n' +
    'getData payspan yesterday \n' +
    '\n' +
    'getData optum anyday\n' +
    'getData optum currentday\n' +
    'getData optum yesterday ',
    HELP_COMMANDS : '<execute> {botname} [opt[multiple,auditor,validator]]\n' +
    '<credentials> {botname}\n' +
    '<getLogs> {botname} [opt[anyday,currentday,yesterday]] - [default[currentday]]\n' +
    '<getData> {botname} [opt[anyday,currentday,yesterday]] - [default[currentday]]',
});
