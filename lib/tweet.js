var TwitterPic = require('twitter-pic'),
  request = require('request');
var twitter = new TwitterPic({
  consumer_key: 'bFsOdzveZjmGHkSxQeavygCiE',
  consumer_secret: 'wjeZ15VwP1PfyVDZLccsozFVVbLDDkXG8Yo1mBqceBElyJZTtE',
  token: '39026423-yEGrZ7zdaoZB2BvdBUeWJg1pcWEWbZgft8Kk3xJLp',
  token_secret: 'ts0OQgQfzvoO8tRNy52hEObju67fUspiBNpEabFV4OWsx'
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