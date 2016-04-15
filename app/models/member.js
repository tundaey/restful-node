// app/models/member.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MemberSchema   = new Schema({
    name: String,
    expertise: String
});

module.exports = mongoose.model('Member', MemberSchema);
