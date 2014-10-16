var mbaasApi = require('fh-mbaas-api');
var express = require('express');
var mbaasExpress = mbaasApi.mbaasExpress();
var cors = require('cors');

// Securable endpoints: list the endpoints which you want to make securable here
var securableEndpoints = ['hello'];

var app = express();

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

app.use('/', require('./lib/hello.js')());

app.use('/cloud/picture', require('./lib/picture.js')());

app.use(express.static(__dirname + '/files'));

// Important that this is last!
app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.VCAP_APP_PORT || 8001;
var server = app.listen(port, function() {
  console.log("App started at: " + new Date() + " on port: " + port);
});


/*
 Inserts an object (document) into a collection in MongoDB
 @param params.insert an object to insert into your database
 @param params.collection the collection to insert it into
 */
// exports.mongodb = function(params, cb){
//   var MongoClient = require('mongodb').MongoClient,
//           format = require('util').format,
//           user = process.env.MONGODB_USER,
//           password = process.env.MONGODB_PASSWORD,
//           upString = (typeof user === 'string' && typeof password === 'string') ? user + ":" + password : "",
//           database = process.env.MONGODB_DATABASE,
//           host = process.env.MONGODB_HOST;

//   MongoClient.connect('mongodb://' + upString + '@' + host + '/' + database, function(err, db) {
//     if(err) return cb(err);

//     var collection = db.collection(params.collection);
//     collection.insert(params.insert, function(err, docs) {
//       db.close();
//       return cb(null, docs);
//     });
//   })

// };
