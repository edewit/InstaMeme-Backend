var TwitterPic = require('twitter-pic');
var request = require('request');

var twitter = new TwitterPic({
  consumer_key: 'SZVqBwG7d6theW9h6hRUg0A3z',
  consumer_secret: 'do6M96v9VMJkOUdYYETDnMEA3suzw3b6x2dcULTYRmZoauZter',
  token: '2838056745-Nep2908vHeATWQa8IHywssWkEGhYLDc3onUHUUe',
  token_secret: 'fa97qzwAAw23dZjThxE0UeKm3hQeSSaOoioUClNYCMfi0'
});

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
  }
};