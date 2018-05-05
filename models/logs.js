'use strict';
let mongoose = require('mongoose');
let mongooseSchema = mongoose.Schema;
let schema = new mongooseSchema({
    id_connection: String,
    date: String,
    acction: String,
    message: String,
    ip: String,
    location: String,
},{
    collection: 'logs'
});
module.exports = mongoose.model('logs', schema);
