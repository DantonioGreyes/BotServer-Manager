const
    fs = require('fs'),
    c = require('./constants.server'),
    main = require('./class.main.server');

let code;
let userData;
let logTmp = [];
let globalLog = {};

class Utils extends main {
    getDataToConnection(request) {
        globalLog = {
            id_connection: request.headers['sec-websocket-key'],
            date: this.customDate('mm/dd/yyyy h:m:i'),
            ip: request.headers['x-forwarded-for'] || request.connection.remoteAddress,
            acction: 'CONNECTED',
        };
        return globalLog;
    }


    log(msg, status = 'I') {



        //status : Success | Error | Warning | Info
        console.log('log > status:', status);
        let options = {
            message: this.customDate('h:m:i') + ' | ' + status + ' | ' + msg,
            files: ['logs/log_' + this.customDate('yyyy-mm-dd') + '.log', c.PATH_TEMP]
        };

        //logTmp.push();
        /*  globalLog[]['status']= status;
          globalLog[]['message']= msg;*/
        if (!fs.existsSync(options.files[0])) {
            fs.writeFileSync(options.files[0], options.message)
        } else {
            //options.files.forEach(file => fs.appendFileSync(file, options.message + '\n'));
            fs.writeFileSync(options.files[0], options.message);
        }


        fs.writeFileSync(options.files[1], options.message);
        console.info('\x1b[36m', options.message, '\x1b[0m');
        /*let O = `{'date':"${this.customDate('h:m:i')}",'status':"${status}", 'message': '${msg}'}`;

        var stats = fs.statSync(options.files[1]);
        var fsSize = stats["size"];

        fs.appendFileSync(options.files[1],fsSize > 0 ? '~'+O : O);
        console.info('\x1b[36m', options.message, '\x1b[0m');*/

        //globalLog['message'] = options.message;
        //return super._dbCreate('logs', globalLog);
    }

    logConnection(data) {
        console.info('\x1b[34m', data, '\x1b[0m');

        let msg = JSON.stringify({'ip': data.ip, 'id': data.id_connection, 'status': 'CONNECTED!', 'Date': data.date});


/*        let msg = '\n' +
            '| IP: ' + data.ip + ' \n' +
            '| ID connection: [' + data.id_connection + '] \n' +
            '| status:  CONNECTED! \n' +
            '| Date:' + data.date;*/
        //globalLog['message'] = msg;
        this.log(msg);
    }

    customDate(...arrgs) {
        let format = arrgs[0] || "mm/dd/yyyy";
        let date = arrgs[1] ? new Date(arrgs[1] + " 12:00:00") : new Date();
        let addDay = arrgs[2] || 0;
        let optReturn = arrgs[3] || false;

        date.setDate(date.getDate() + addDay);

        let month = String(date.getMonth() + 1);
        let day = String(date.getDate());
        let year = String(date.getFullYear());

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        let result = format.replace(/[a-zA-z]+/gi, (str) => {
            switch (str) {
                case "mm":
                    return month;
                case "dd":
                    return day;
                case "yyyy":
                    return year;
                case "yy":
                    return year.substr(-2);
                case "H":
                    return (date.getHours() + 24) % 12 || 12;
                case "h":
                    return date.getHours();
                case "m":
                    return date.getMinutes().toString().length < 2 ? '0' + date.getMinutes() : date.getMinutes();
                case "i":
                    return date.getSeconds().toString().length < 2 ? '0' + date.getSeconds() : date.getSeconds();
                default:
                    return str;
            }
        });
        return optReturn ? new Date(result + " 12:00:00") : result;
    }

    getUserWithGithub(token) {
        let object = {
            client_id: c.GITHUB_CLIENT_ID,
            client_secret: c.GITHUB_CLIENT_SECRET,
            code: token,
            format: 'json'
        };
        let urlGetToken = c.GITHUB_URL_ACCESS + '?' + Object.keys(object).map(k => `${k}` + '=' + encodeURIComponent(object[k])).join('&');
        let tokenAccess = super.serverRequestSync('GET', urlGetToken, '');

        if (tokenAccess.access_token === undefined) return false;

        let urlGetUser = c.GITHUB_URL_USER + '?access_token=' + tokenAccess.access_token;
        let user = super.serverRequestSync('GET', urlGetUser, '');
        user['code'] = code;
        user['token'] = tokenAccess.access_token;
        code = token;
        userData = user;
        fs.writeFileSync(__dirname + '/../.tmp/' + user.token + '.json', JSON.stringify(user)); //ToDo - Crear constante
        return user;
    }

    webSocketCommands(sCommands) {
        console.log('>>>>>>>',sCommands);
        let commands = sCommands.split(' ');
        try {
            switch (commands[0]) {
                case 'execute':
                    let getParam = this.getParamatersBots(commands[1] + ' ' + (commands[2] || ''));
                    if (!getParam) {
                        this.log('error en el comando');
                        return;
                    }
                    this.getCredentials(commands[1], getParam.act);
                    let executionBot = super.executeBots(getParam.path, getParam.opt);
                    this.log(getParam.msg);
                    return executionBot;

                case 'getFile':
                    break;
                case 'credentials':
                    break;
                case 'help':
                    return c.HELP_COMMANDS;
                default :
                    return '[' + sCommands + '] sorry, it is not a valid command';
            }
        } catch (e) {
            console.log(e);
        }
    }

    getParamatersBots(botname) {
        this.log('getParamatersBots [' + botname + ']');
        switch (botname) {
            case 'medictouch ':
                return {
                    msg: 'Start execution Bot [' + botname + ']',
                    path: c.PATH_BOT('_' + botname.toUpperCase()),
                    opt: {}
                };
            case 'medictouch auto':
                return {
                    msg: 'Start execution Bot [' + command + ']',
                    path: c.PATH_BOT(command),
                    opt: {}
                };
            case 'medictouch validator':
                return {
                    msg: 'Start execution Bot [' + command + ']',
                    path: c.PATH_BOT(command),
                    opt: {}
                };
            case 'optum ' :
                return {
                    msg: 'Start execution Bot [' + command + ']',
                    path: c.PATH_BOT(command),
                    opt: {}
                };
            case 'optum auditor' :
                return {
                    msg: 'Start execution Bot [' + botname + ']',
                    path: c.PATH_BOT(botname.toUpperCase()),
                    act: ['multiple'],
                    opt: {maxInstances: 1}
                };
            case 'optum validator' :
                return {
                    msg: 'Start execution Bot [' + command + ']',
                    path: c.PATH_BOT(command),
                    opt: {maxInstances: 1}
                };
            case 'payspan ' :
                return {
                    msg: 'Start execution Bot [' + command + ']',
                    path: c.PATH_BOT(command),
                    opt: {maxInstances: 1}
                };
            case 'payspan multiple' :
                return {
                    msg: 'Start execution Bot [' + botname + ']',
                    path: c.PATH_BOT('_' + botname.split(' ')[0].toUpperCase()),
                    opt: {maxInstances: 10},
                    act: ['multiple', 'template_01.js']
                };
            case 'payspan auditor' :
                return {
                    msg: 'Start execution Bot [' + botname + ']',
                    path: c.PATH_BOT('_' + botname.split(' ')[0].toUpperCase()),
                    opt: {maxInstances: 10},
                    act: ['multiple', 'template_02.js']
                };
            case 'payspan validator' :
                return {
                    msg: 'Start execution Bot [' + botname + ']',
                    path: c.PATH_BOT('_' + botname.split(' ')[0].toUpperCase()),
                    opt: {maxInstances: 10},
                    act: ['multiple', 'template_03.js']
                };
            default:
                return false;
        }
    }

    deleteFile(name) {
        try {
            fs.unlink(name, (err) => {
                if (err) {
                    this.log("failed to delete file:" + err);
                } else {
                    this.log('successfully deleted local image');
                }
            });
        } catch (e) {
            this.log(e)
        }
    }

    async getCredentials(botname, objOption) {
        console.log(objOption[0]);
        //ToDo - debe enviar botName convertido, (template o Script_0x)
        try {
            let dirFile = __dirname + '/../services/_' + botname.toUpperCase() + '/.tmp/botTemp.';
            const groupBy = (xs, key) => {
                return xs.reduce(function (rv, x) {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, {});
            };
            const credentials = await this._APIRead('credentials', {'botname': botname});

            if (objOption[0] === 'multiple') {
                let CredentialsMultiResult = JSON.parse(JSON.stringify(groupBy(credentials[0].credentials, 'client_id')));
                for (let i = 0; i < Object.keys(CredentialsMultiResult).length; i++) {
                    //console.log('----------------------------------------' + Object.keys(CredentialsMultiResult)[i]);
                    let credentials = JSON.stringify((CredentialsMultiResult)[Object.keys(CredentialsMultiResult)[i]]);
                    fs.writeFileSync(dirFile + i + '.js', 'let data = ' + credentials + '; \n ' + fs.readFileSync(__dirname + '/../services/_' + botname.toUpperCase() + '/' + objOption[1], 'utf8'));
                }
                this.log('---cloned completed!')

            }

        } catch (e) {
            console.log(e);
        }


    }

    getCookiesToken(cookies) {
        let token = cookies
            .split(';')
            .filter(x => {
                return x.split('=')[0].trim() === 'token' ? x : void 0
            });
        return token.length !== 0 ? token[0].split('=')[1] : false;
    }

    readFile(path) {
        return fs.readFileSync(path, 'utf8');
    }

    clearTemp(path) {
        fs.writeFileSync(path, '');
    }
}

module.exports = Utils;