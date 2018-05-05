const request = require('request');
const requestSync = require('sync-request');
const utils = require('./class.utils.server');
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
        }catch (e) {
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
    }

}
module.exports = Main;
