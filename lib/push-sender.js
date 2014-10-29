var sender = require('unifiedpush-node-sender');


var message = {
  alert: "New Picture Uploaded",
  sound: "default",
  badge: 2,
};

var settings = {
  serverUrl: 'https://push-ipaasdevoxx.rhcloud.com/ag-push/',
  applicationID: "919ca17d-dc3f-46b7-b33d-7bf7a58ba9aa",
  masterSecret: "fc986562-9480-4cf0-b86e-42af613a075c",
  ttl: 3600,
};

module.exports = {
  send: function (url, fn) {

    message.url = url;
    message['simple-push'] = new Date().getTime();
    sender.Sender(settings.serverUrl).send(message, settings, function(err) {
      if (err) {
        return fn(err);
      }

      return fn(null, 'ok');
    });
  }
};
