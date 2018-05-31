const
    fs = require('fs'),
    c = require('./constants.server'),
    main = require('./class.main.server'),
   imaps = require('imap-simple');

let
    code,
    userData,
    globalLog = {};

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
        //status :
        // [S]uccess
        // [E]rror
        // [W]arning
        // [I]nfo

        let options = {
            message: this.customDate('h:m:i') + ' | ' + status + ' | ' + msg,
            files: ['logs/log_' + this.customDate('yyyy-mm-dd') + '.log', c.PATH_TEMP]
        };

        !fs.existsSync(options.files[0])
            ? fs.writeFileSync(options.files[0], options.message)
            : fs.appendFileSync(options.files[0], options.message);

        //fs.writeFile(options.files[1], options.message, function(err) {
        //   if(err)
                fs.writeFileSync(options.files[1], options.message);
        //});

        console.info('\x1b[36m', options.message, '\x1b[0m');
    }

    logConnection(data) {
        let msg = JSON.stringify({'ip': data.ip, 'id': data.id_connection, 'status': 'CONNECTED!', 'Date': data.date});
        this.log(msg);
    }

    /**
     * customDate()
     * @param arrgs(format, date, addDay, typeReturn)
     * @returns {any}
     */
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
        result = result.replace(/~/g, '');
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
        this.log('webSocketCommands ['+sCommands+']');
        let commands = sCommands.split(' ');
        try {
            switch (commands[0]) {
                case 'execute':
                    let getParam = this.getParamatersBots(commands[1] + '_' + (commands[2] || '') + (commands[3] || '--S'));
                    if (!getParam) {
                        this.log('error in the command ['+commands[1]+'] or ['+commands[2]+'] ', 'E');
                        return;
                    }
                    if(!this.getCredentials(commands[1], getParam.act)) return;

                    super.executeBots(getParam.path, getParam.opt);
                    this.log(getParam.msg);

                    return 'Please wait executionBot in progress...';
                case 'getFile':
                    break;
                case 'credentials':
                    break;
                case 'help':
                    return c.HELP_COMMANDS;
                case 'kill_process':
                      process.exit(1);
                    return false;
                default :
                    return '[' + sCommands + '] sorry, it is not a valid command';
            }
        } catch (e) {
            console.log(e);
        }
    }

    getParamatersBots(botname) {
        this.log('getParamatersBots ['+botname+']');
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
            case 'payspan_download--M' :
                return {
                    msg: 'Start execution Bot [' + botname + ']',
                    path: c.PATH_BOT('_' + botname.split('_')[0].toUpperCase()),
                    opt: {maxInstances: 10},
                    act: ['multiple', 'template_01.js']
                };
            case 'payspan_download--S' :
                return {
                    msg: 'Start execution Bot [' + botname + ']',
                    path: c.PATH_BOT('_' + botname.split('_')[0].toUpperCase()),
                    opt: {maxInstances: 1},
                    act: ['multiple', 'template_01.js']
                };
            case 'payspan_validate--S' :
                return {
                    msg: 'Start execution Bot [' + botname + ']',
                    path: c.PATH_BOT('_' + botname.split('_')[0].toUpperCase()),
                    opt: {maxInstances: 1},
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

    imapGetCodeActivate() {
        let searchCritera = c.IMAP_SEARCH_CRITERIAL(this.customDate(null, null, -1, true));
        let fetchOption = c.IMAP_FETCH_OPTION;
        let config = c.IMAP_CREDENTIALS;

        return imaps
            .connect(config)
            .then(connection => connection
                .openBox('INBOX')
                .then(() => connection
                    .search(searchCritera, fetchOption)
                    .then(results => results
                        .map(res => res.parts
                            .filter(part => part.which === 'TEXT')[0]
                            .body
                            .replace(/\r\n/g, '~')
                            .split('~')
                            .filter(response => response !== '')[7]
                            .replace('Your authentication code is ', '')))));
    }

    async getCredentials(botname, objOption) {
        try {
            let dirFile = __dirname + '/../services/_' + botname.toUpperCase() + '/.tmp/botTemp.';
            let infoFile = __dirname + '/../services/_' + botname.toUpperCase() + '/data/';
            const groupBy = (xs, key) => {
                return xs.reduce(function (rv, x) {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, {});
            };

            const credentials = await this._APIRead('credentials', {'botname': botname});

            fs.writeFileSync(infoFile + 'access.json',JSON.stringify(credentials), 'utf8');


            if (objOption[0] === 'multiple') {
                let template = fs.readFileSync(__dirname + '/../services/_' + botname.toUpperCase() + '/' + objOption[1], 'utf8');
                let CredentialsMultiResult = JSON.parse(JSON.stringify(groupBy(credentials[0].credentials, 'client_id')));
                let client_id = Object.keys(CredentialsMultiResult).length;
                let acounts = credentials[0].credentials.length;
                for (let i = 0; i < 1/*client_id*/; i++) {
                    let credentials = JSON.stringify((CredentialsMultiResult)[Object.keys(CredentialsMultiResult)[i]]);
                    fs.writeFileSync(dirFile + i + '.js', 'let data = ' + credentials + '; \n ' + template);
                }
                this.log('--- Cloned completed!');
                if(client_id !== fs.readdirSync(__dirname + '/../services/_' + botname.toUpperCase() + '/.tmp/').length){
                    console.log('error: la catidad de archivos "botTemp.js" es diferente a la cantidad de clientes existente');
                    console.log(client_id,fs.readdirSync(__dirname + '/../services/_' + botname.toUpperCase() + '/.tmp/').length);
                    return false;
                }else{
                    let totalTest = template.split('it(');
                    this.log("total Acounts : "+ acounts+' == '+acounts+'/'+(totalTest.length-1));
                    return true;
                }
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

    clearTemp(path) {
        fs.writeFileSync(path, '');
    }
}

module.exports = Utils;