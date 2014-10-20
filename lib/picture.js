var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var push = require('./push-sender');
var shelljs = require('shelljs');
var $fh = require('fh-mbaas-api');
var meme = require('./meme');
var tweet = require('./tweet');

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

  picture.get('/org/:id', function(req, res) {
    res.sendfile('./original/'+req.params.id);
  });
  
  // POST REST endpoint - note we use 'body-parser' middleware above to parse the request body in this route.
  // This can also be added in application.js
  // See: https://github.com/senchalabs/connect#middleware for a list of Express 4 middleware
  picture.post('/', function(req, res) {
    var data = req.body.data
      tag = '#RHTDX' + Math.floor(Math.random() * 100);
    
    $fh.db({
      "act": "create",
      "type": "tags",
      "fields": {
        "tag": tag
      }
    }, function(err, entity) {
      if (err) {
        console.log('Picture write failed');
        console.log("Error " + err);
      } else {
        var saveTo = path.join(__dirname + '/../original', entity.guid + '.jpg');
        fs.writeFile(saveTo, data, 'base64', function(err) {
          if (err) console.log(err);
          //tweet.update('Tweet a meme ' + tag, 'https://redhat-demos-t-4kohj9jgj0gzmpajdwf2ix0u-dev.ac.gen.ric.feedhenry.com/org/' + entity.guid + '.jpg');
        });
      }
    });
    
    res.writeHead(200, { 'Connection': 'close' });
    res.end("That's all folks!");
  });
  
  picture.post('/retweet', function(req, res) {
    var url = req.body.url,
        file = url.substr(url.lastIndexOf('/') + 1);

    $fh.db({
      "act": "list",
      "type": "meme",
      "eq": {
        "picture": file
      }
    }, function (err, found) {
      if (err) {
        console.error('Could not find tag ' + err);
      } else {
        var entity = found.list[0];
        tweet.update(entity.top + ' ' + entity.tag, url);
      }
    });
    
  });
  
  picture.post('/meme', function(req, res) {
    var data = req.body;
    
    $fh.db({
      "act": "list",
      "type": "tags",
      "eq": {
        "tag": data.tag
      }
    }, function (err, found) {
      if (err) {
        console.error('Could not find tag ' + err);
      } else {
        var entity = found.list[0];
        var file = path.join(__dirname + '/../original', entity.guid + '.jpg'),
          picture = meme.create(file, data.meme);
        
        push.send('https://redhat-demos-t-4kohj9jgj0gzmpajdwf2ix0u-dev.ac.gen.ric.feedhenry.com/' + path.basename(picture), function (err, result) {
          console.log(err, result);
        });
        
        $fh.db({
          "act": "create",
          "type": "meme",
          "fields": {
            "meme-top": meme.top,
            "meme-bottom": meme.bottom,
            "tag": data.tag,
            "picture": picture
          }
        }, function(err, entity) {
          if (err) {
            console.log('Meme save failed');
            console.log("Error " + err);
          } 
        });
      }
    });
    
    res.writeHead(200, { 'Connection': 'close' });
    res.end(picture);
  });

  picture.delete('/', function(req, res) {
    shelljs.rm('-rf', './files/*');

    res.send();
  });
  return picture;
}

module.exports = pictureRoute;
