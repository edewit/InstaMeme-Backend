var $fh = require('fh-mbaas-api');
module.exports = {
  send: function (url, fn) {
    $fh.service(
      {
        guid: process.env.AEROGEAR_SERVICE_GUID,
        endpoint: "/send",
        params: {
          message : {
            alert: "New Picture Uploaded",
            url: url
          }
        }
      },
      function(err, data) {
        if (err) {
          return fn(err);
        }
        return fn(null, 'ok');
      }
    );
  }
};
