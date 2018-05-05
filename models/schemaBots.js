let mongoose     = require('mongoose');
let Schema       = mongoose.Schema;

let BearSchema   = new Schema({
    name: String
},{
    collection: 'collectionName'
});

module.exports = mongoose.model('Bear', BearSchema);