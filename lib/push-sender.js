var winston = require('winston');

// Ensure we display timestamps in logs
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {'timestamp' : true});

var $fh = require('fh-mbaas-api');
module.exports = {
  send: function (url, fn) {
    winston.info('Calling service to send push message');
    $fh.service(
      {
        guid: process.env.AEROGEAR_SERVICE_GUID,
        endpoint: "send",
        params: {
          message : {
            alert: "New Picture Uploaded",
            url: url
          }
        }
      },
      function(err, data) {
        winston.info('Back from AeroGear Push Service - err = ', err, ' :: data = ', data);
        if (err) {
          return fn(err);
        }
        return fn(null, 'ok');
      }
    );
  }
};
