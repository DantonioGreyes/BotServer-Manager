const request = require('request');
const requestSync = require('sync-request');
const c = require('./constants.server');
const Launcher = require('webdriverio').Launcher;

class Main {

    executeBots(path, opt){
    return new Launcher(path, opt).run();
}

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
        console.log('URL:',url);
        console.log('Query:',content);

        return JSON.parse(requestSync('POST', url, content).getBody());
    };

    serverRequestSync(method, url, data) {
        let body = (data instanceof Object) ? Object.keys(data).map(k => `'${k}'` + '=' + encodeURIComponent(data[k])).join('&') : (typeof data === 'string') && data;
        let responseServer = requestSync(method, url, {
            headers: {'user-agent': 'node.js'},
            body: body
        });
        return JSON.parse(responseServer.getBody('utf8'));
    }

    async  _APIRead(collection, data){
        try {
            //console.log(data);
            let models = require(`../models/${collection}`);
            return await models.find(data).exec();

        }
        catch (e) {
            console.error('ERROR: ', e);
            return 'ERROR: ' + e;
        }
    }


}

module.exports = Main;
