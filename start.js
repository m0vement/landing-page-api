require('babel/register');
var Mongoose = require ('mongoose');
var createServer = require('./src/server');

Mongoose.connect(~~process.env.MONGOLAB_URI || 'mongodb://localhost/signups');
createServer(~~process.env.PORT || 3000);