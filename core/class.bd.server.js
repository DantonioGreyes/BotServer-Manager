'use strict';
const c = require('./constants.server');
const mongoose = require('mongoose');
mongoose.connect(c.MONGODB_URL_CONNECTION);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
module.exports = db;
