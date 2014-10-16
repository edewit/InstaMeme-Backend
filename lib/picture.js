var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var cors = require('cors');
var Busboy = require('busboy');
var path = require('path');
var push = require('./push-sender');
var shelljs = require('shelljs');

var im = require('imagemagick');

function pictureRoute() {
  var picture = new express.Router();
  picture.use(cors());
  picture.use(bodyParser());

  picture.get('/', function(req, res) {
    console.log('getting files');
    fs.readdir(__dirname + '/../files/', function (err, files) {
      if(err) {
        res.status(400);
        return res.send({err: err});
      }

      res.send({pictures: files});
    });
  });

  picture.get('/:id', function(req, res) {
    res.sendfile('./files/'+req.params.id);
  });

  // POST REST endpoint - note we use 'body-parser' middleware above to parse the request body in this route.
  // This can also be added in application.js
  // See: https://github.com/senchalabs/connect#middleware for a list of Express 4 middleware
  picture.post('/', function(req, res) {
    var busboy = new Busboy({ headers: req.headers });

    var saveTo, meme = {};
    
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log(arguments);
      saveTo = path.join(__dirname + '/../files', path.basename(filename));
      console.log(saveTo);
      file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      meme[fieldname] = val;
    });
    busboy.on('finish', function() {

      setTimeout(function () {
        im.convert(['-background', 'none', '-stroke', 'black', '-fill', 'white', '-gravity', 'center', '-size', '640x100', 'caption:' + meme.bottom, saveTo, '+swap', '-gravity', 'south', '-composite', saveTo],
          function (err, stdout) {
            if (err) console.log(err);
          });

        im.convert(['-background', 'none', '-stroke', 'black', '-fill', 'white', '-gravity', 'center', '-size', '640x100', 'caption:' + meme.top, saveTo, '+swap', '-gravity', 'north', '-composite', saveTo],
          function (err, stdout) {
            if (err) console.log(err);
          });

      }, 500);
      
      push.send('', function (err, result) {
        console.log(err, result);
      });
      res.writeHead(200, { 'Connection': 'close' });
      res.end("That's all folks!");
    });
    return req.pipe(busboy);
  });

  picture.delete('/', function(req, res) {
    shelljs.rm('-rf', './files/*');

    res.send();
  });
  return picture;
}

module.exports = pictureRoute;
