const request = require('request');
const requestSync = require('sync-request');
const c = require('./constants.server');

class Main {
    _dbCreate(collection, data) {
        //method : post
        //url : http://localhost:3000/create/:collection/
        //operation : insertOne()
        let content = {
            url: c.CRUD_CREATE + collection,
            headers: c.CONTENT_TYPE_JSON,
            form: data
        };
        try {
            request.post(content, (error, response, body) => {
                if (error) throw error;
                return body;
            });
        } catch (e) {
            console.log('request POST error:', e);
        }

    };

    _dbReadSync(collection, data) {
        //method : get
        //url : http://localhost:3000/read/:collection/
        //operation : find()
        let url = c.CRUD_READ + collection;
        let content = {
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            body: Object.keys(data).map(k => `${k}` + '=' + encodeURIComponent(data[k])).join('&')
        };
        //console.log(content);
        return JSON.parse(requestSync('POST', url, content).getBody());
    };

    webSocketCommands(cammand) {
        switch (cammand) {
            case '_MedicTouch':
                return {
                    msg: 'Start execution Bot [' + cammand + ']',
                    path: c.PATH_BOT(cammand),
                    opt: {}
                };
            case '_Optum' :
                return {
                    msg: 'Start execution Bot [' + cammand + ']',
                    path: c.PATH_BOT(cammand),
                    opt: {}
                };
            case '_PaySpan' :
                return {
                    msg: 'Start execution Bot [' + cammand + ']',
                    path: c.PATH_BOT(cammand),
                    opt: {maxInstances: 1}
                };
            case '_PaySpan credentials audit' :
                botServer.multiInstaces();
                let msg = cammand.split(' ');
                return {
                    opt: {maxInstances: 1},
                    act: {action: msg[1] + '.' + msg[2]},
                    path: c.PATH_BOT(msg[0]),
                    actPath: 'bots/' + msg[0] + '/.temp/action.json',
                    msg: 'Start execution Bot [' + cammand + ']'
                };
            default:
                return {
                    msg: '[' + cammand + '] sorry, it is not a valid command'
                }
        }
    };

    serverRequestSync(method, url, data) {
        let body = (data instanceof Object) ? Object.keys(data).map(k => `'${k}'` + '=' + encodeURIComponent(data[k])).join('&') : (typeof data === 'string') && data;
        let responseServer = requestSync(method, url, {
            headers: {'user-agent': 'node.js'},
            body: body
        });
        return JSON.parse(responseServer.getBody('utf8'));
    }
}

module.exports = Main;
