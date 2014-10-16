var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var $fh = require('fh-mbaas-api');

function helloRoute() {
  var hello = new express.Router();
  hello.use(cors());
  hello.use(bodyParser());


  // GET REST endpoint - query params may or may not be populated
  // hello.get('/', function (req, res) {
  //   console.log('in getList with ts:' + Date.now());

  //   $fh.db({
  //     "act": "list",
  //     "type": "pictures"
  //   }, function (err, data) {
  //     res.json({
  //       status: "ok",
  //       pictures: data
  //     });
  //   });
  //   // see http://expressjs.com/4x/api.html#res.json
  // });

  // // POST REST endpoint - note we use 'body-parser' middleware above to parse the request body in this route.
  // // This can also be added in application.js
  // // See: https://github.com/senchalabs/connect#middleware for a list of Express 4 middleware
  // hello.post('/postPicture', function (req, res) {
  //   //var data = req.body && req.body.data ? req.body.data : 'World';

  //   console.log(req);
  //   $fh.db({
  //     "act": "create",
  //     "type": "pictures",
  //     "fields": {
  //       "data": req.body.data,
  //       //"ts": params.ts,
  //       "transferred": false
  //     }
  //   }, function (err, data) {
  //     if (err) {
  //       console.log('Picture write failed');
  //       console.log("Error " + err);
  //     } else {
  //       console.log('Picture wrote okay!');

  //       res.json({
  //         status: "ok"
  //       });
  //     }
  //   });
  // });

  return hello;
}

module.exports = helloRoute;
