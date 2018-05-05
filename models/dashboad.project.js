'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({any: {}}
    ,{
    collection: 'dashboard_project',
    strict: false
});
module.exports = mongoose.model('dashboard', UserSchema);