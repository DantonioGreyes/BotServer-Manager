'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    login: String,
    name: String,
    surname: String,
    nick: String,
    email: String,
    password: String,
    token: String,
    role: String,
    image: String
},{
    collection: 'users'
});
module.exports = mongoose.model('User', UserSchema);