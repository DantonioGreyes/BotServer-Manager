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
    watch = require('node-watch'),
    path = require('path'),
    Ws = require('ws').Server,
    fs = require('fs'),
    c = require('./core/constants.server');
let
    app = express(),
    wss = new Ws({port: c.WS_PORT}),
    util = new utils(),
    router = express.Router(),
    adminTheme = 'dark';

database.on('error', console.error.bind(console, 'MongoDB connection error:'));

wss.on('connection', function (ws, req) {
    util.clearTemp(c.PATH_TEMP);
    let watcher = watch(c.PATH_TEMP, {recursive: true});
    watcher.on('change', function (event, filename) {
        fs.readFile(c.PATH_TEMP, 'utf8', function (err, data) {
            //if (err) console.log('\x1b[43m', err, '\x1b[0m');

            ws.send(data, function (err) {
                if (err) throw  err;
            });

            fs.unlink(c.PATH_TEMP, (err) => {
                // if (err) console.log('\x1b[43m', "failed to delete file:" + err, '\x1b[0m');
            });
        });

    });
    let dataConnection = util.getDataToConnection(req);
    util.logConnection(dataConnection);
    ws.on('message', function (messages) {
        util.log(messages);
        let parameters = util.webSocketCommands(messages);
        (parameters) && util.log(JSON.stringify(parameters));
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

app.use("/css", express.static(__dirname + '/public/' + adminTheme + '/css/'));
app.use("/js", express.static(__dirname + '/public/' + adminTheme + '/js/'));
app.use("/scss", express.static(__dirname + '/public/' + adminTheme + '/scss/'));
app.use("/assets",express.static(__dirname + '/public/assets/'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public/' + adminTheme + '/'));
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


router.route('/mail/activecode')
    .post((req, res) => {
        util.imapGetCodeActivate().then((result) => res.send(result));
    });

router.route('/create/:models')
    .post((req, res) => {
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
    .post((req, res) => {
        console.log('entro en Read/models');
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
    .post((req, res) => {
        let models = require(`./models/dashboad.project`);
        models.find(function (err, response) {
            if (err)
                res.send(err);
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.json(response[0]);
        });
    });

router.route('/authenticated/:models')
    .post((req, res) => {
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
    .post(async (req, res) => {
        //console.log('query:', req.body);
        //let result =
        const consult = await util._APIRead('credentials', req.body);
        console.log(consult);
        res.send(JSON.stringify(consult));
        //result.then(response => res.send(response));
    });

router.route('/users/:name')
    .get((req, res) => {
        let user = new User(req.body.name);
        //user.name = req.body.name;
        user.save(function (err) {
            if (err)
                res.send(err);
            res.json({message: 'Bear created!'});
        });
    });

router.get('/', (req, res) => {
    // res.json({message: 'hooray! welcome to our api!'});
    res.redirect('/index');
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

app.get('/index', (req, res) => {
    res.sendFile(path.resolve('public/dark/pages-login-2.html'));
});