var sender = require('unifiedpush-node-sender');


var message = {
  alert: "New Picture Uploaded",
  sound: "default",
  badge: 2,
};

var settings = {
  applicationID: "3af837ad-dd32-4cac-a19f-2f4fed8bce9c",
  masterSecret: "6ffb7bba-5637-42d5-b680-2fed90914d06",
  ttl: 3600,
};

module.exports = {
  send: function (url, fn) {

    message.url = url;
    sender.Sender('https://supersimple-lholmqui.rhcloud.com/ag-push/').send(message, settings, function(err) {
      if (err) {
        return fn(err);
      }

      return fn(null, 'ok');
    });
  }
};
