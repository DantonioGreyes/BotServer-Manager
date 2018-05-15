/**************************************************************************
 * SERVER BOT MANAGER
 *
 * This server controls all operations the bots, connexion with database,
 * implementation of API RESTful and WebSocket for generate reports in real
 * time.
 *-------------------------------------------------------------------------
 *
 * Created      18/05/2018 11:33 AM
 * Author       Jesus Perez jasp402@gmail.com
 * Copyright    Codisoti – www.codisoti.pe
 * Version      2.0.0
 *
 * for more info. Review ./package.json
 *
 **************************************************************************/
const
    bodyParser = require('body-parser'),
    database = require('./core/class.bd.server'),
    express = require('express'),
    utils = require('./core/class.utils.server'),
    Ws = require('ws').Server,
    fs = require('fs'),
    c = require('./core/constants.server'),
    watch = require('node-watch');

let
    router = express.Router(),
    app = express(),
    wss = new Ws({port: c.WS_PORT}),
    util = new utils();

database.on('error', console.error.bind(console, 'MongoDB connection error:'));



wss.on('connection', function (ws, req) {
    util.clearTemp(c.PATH_TEMP);

    let watcher = watch(c.PATH_TEMP, {recursive: true});

    watcher.on('change', function (event, filename) {
        ws.send(util.readFile(c.PATH_TEMP));
    });

    let dataConnection = util.getDataToConnection(req);
    util.logConnection(dataConnection);


    ws.on('message', function (messages) {
        util.log(messages);
        let parameters = util.webSocketCommands(messages);
        util.log(JSON.stringify(parameters));
        //ws.send(JSON.stringify(parameters));
        //ws.send(JSON.stringify(result));
    });

    ws.on('close', function close() {
        console.log('disconnected');
        watcher.close();
        ws.terminate();
    });

    ws.on('error', function close() {
        console.log('disconnected by Error!');
        watcher.close();
        ws.terminate();
    })
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    console.log('End Point:', req.url);

    next();
});

app.use('/api', router);
app.listen(c.PORT_SERVER);
console.log(c.APP_NAME,
    '\n Listing PORT: ', c.PORT_SERVER,
    '\n WebSockect PORT: ', c.WS_PORT);


router.route('/create/:models')
    .post(function (req, res) {
        try {
            let models = require(`./models/${req.params.models}`);
            if (Object.keys(req.query).length > 0) {
                models.find(req.query, function (err, response) {
                    if (err) throw err;
                    response
                        ? res.json(response)
                        : models.create(req.body, function (err, response) {
                            if (err) throw err;
                            response && res.json(response)
                        });
                });
            } else {
                models.create(req.body, function (err, response) {
                    if (err) throw err;
                    if (response) {
                        res.json(response)
                    }
                });
            }
        }
        catch (e) {
            console.error('ERROR: ', e);
            res.send('ERROR: ' + e);
        }
    });

router.route('/read/:models')
    .post(function (req, res) {
        console.log('entro en Read/models')
        try {
            let models = require(`./models/${req.params.models}`);
            let query = req.body;
            console.log(query);
            models.find(query, (err, response) => {
                if (err) throw err;
                res.json(response);
            });
        }
        catch (e) {
            console.error('ERROR: ', e);
            res.send('ERROR: ' + e);
        }
    });

router.route('/dashboard/project/:idUser')
    .post(function (req, res) {
        let models = require(`./models/dashboad.project`);
        models.find(function (err, response) {
            if (err)
                res.send(err);
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.json(response[0]);
        });
    });

router.route('/authenticated/:models')
    .post(function (req, res) {
        let models = require(`./models/${req.params.models}`);
        let login = {login: req.body.login, password: req.body.password};
        models.find(login, function (err, response) {
            if (err)
                res.send(err);
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.json(response);
        });
    });

router.route('/credentials')
    .post(async function (req, res) {
        //console.log('query:', req.body);
        //let result =
        const consult = await util._APIRead('credentials', req.body);
        console.log(consult);
        res.send(JSON.stringify(consult));
        //result.then(response => res.send(response));
    });

router.route('/users/:name')
    .get(function (req, res) {
        let user = new User(req.body.name);
        //user.name = req.body.name;
        user.save(function (err) {
            if (err)
                res.send(err);
            res.json({message: 'Bear created!'});
        });
    });


router.get('/', function (req, res) {
    res.json({message: 'hooray! welcome to our api!'});
});

/*
app.get('/home',(req,res)=>{
    !util.validateLogin(req.headers.cookie) &&  res.sendFile(__dirname+'/public/index.html');
    let user = util.getUserWithGithub(req.query.code ||req.headers.cookie.split(';')[0].split('=')[1]);
    if(Object.keys(user).length > 0){
        res.sendFile(__dirname+'/public/dashboard.html');
        res.cookie('code',user.code, { maxAge: 900000, httpOnly: true })
    }
});
*/

app.get('/home', (req, res) => {
    let resultToken = req.headers.cookie ? util.getCookiesToken(req.headers.cookie) : false;
    if (resultToken) {
        res.sendFile(__dirname + '/public/dashboard.html');
    }
    (!req.query.code && !resultToken) && res.redirect('/');

    if (!resultToken && req.query.code) {
        let code = req.query.code;
        let user = util.getUserWithGithub(code);

        if (user === undefined) res.send(user);

        if (Object.keys(user).length > 0) {
            res.sendFile(__dirname + '/public/dashboard.html');
            res.cookie('token', user.token, {maxAge: 9999999, httpOnly: true})
        }
    }
});

app.get('/.tmp', (req, res) => {
    let token = req.headers.cookie ? util.getCookiesToken(req.headers.cookie) : res.redirect('/');
    let response = fs.readFileSync('.tmp/' + token + '.json', 'utf8');
    res.send(response)
});

