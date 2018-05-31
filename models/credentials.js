'use strict';
let mongoose = require('mongoose');
let mongooseSchema = mongoose.Schema;
let schema = new mongooseSchema({
    baseUrl: String,
    botname: String,
    credentials: [{
            client_id : Number,
            user : String,
            password : String,
            lastDate : String,
        }]
},{
    collection: 'bots_information',
    strict: false
});
module.exports = mongoose.model('credentials', schema);
