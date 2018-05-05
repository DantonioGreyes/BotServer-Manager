const
    fs = require('fs'),
    c = require('./constants.server'),
    main = require('./class.main.server');

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

    log(msg) {
        let options = {
            message: this.customDate('h:m:i') + " | " + msg,
            files: ['logs/log_' + this.customDate('yyyy-mm-dd') + '.log', c.PATH_TEMP]
        };
        !fs.existsSync(options.files[0])
            ? fs.writeFileSync(options.files[0], options.message)
            : options.files.forEach(file => fs.appendFileSync(file, options.message + '\n'));

        console.info('\x1b[34m', options.message, '\x1b[0m');
        globalLog['message'] = options.message;
        return super._dbCreate('logs', globalLog);
    }

    logConnection(data) {
        console.info('\x1b[34m', data, '\x1b[0m');
        let msg = '\n' +
            '| IP: ' + data.ip + ' \n' +
            '| ID connection: [' + data.id_connection + '] \n' +
            '| status:  CONNECTED! \n' +
            '| Date:' + data.date;
        globalLog['message'] = msg;
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
}

module.exports = Utils;