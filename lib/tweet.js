var fs = require('fs');
var Twit = require('twit')
var TwitterPic = require('twitter-pic');
var request = require('request');
var twitter = new TwitterPic(config);

var config = {
  consumer_key: 'SZVqBwG7d6theW9h6hRUg0A3z',
  consumer_secret: 'do6M96v9VMJkOUdYYETDnMEA3suzw3b6x2dcULTYRmZoauZter',
  token: '2838056745-Nep2908vHeATWQa8IHywssWkEGhYLDc3onUHUUe',
  token_secret: 'fa97qzwAAw23dZjThxE0UeKm3hQeSSaOoioUClNYCMfi0'
};

var T = new Twit({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token: config.token,
  access_token_secret: config.token_secret
});

var stream = T.stream('statuses/filter', {
  track: '#RHTDX'
});

var blacklist = JSON.parse(fs.readFileSync(__dirname + '/bad-words.json'));

module.exports = {
  update: function (status, url) {
    twitter.update({
        media: request(url),
        status: status
      },
      function (error, result) {
        if (error) {
          return console.error('Nope!', error);
        } else {
          console.log(result);
        }
      }
    );
  },
  monitor: function (callback) {
    stream.on('tweet', function (tweet) {
      function isBlacklisted(string) {
        for (var word in blacklist) {
          if (string.indexOf(word) >= 0) {
            return true;
          }
        }
        return false;
      }
      
      var text = tweet.text.toLowerCase();
      if (!isBlacklisted(text)) {
        callback(tweet);
      }
    });
  }
};