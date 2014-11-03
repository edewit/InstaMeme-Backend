var im = require('imagemagick');
var Guid = require('guid');
var path = require('path');
var fs = require('fs');

module.exports = {
  create: function (filename, meme, callback) {
    var saveTo = path.join(__dirname + '/../files', Guid.create() + '.jpg'),
      reader = fs.createReadStream(filename);

    reader.pipe(fs.createWriteStream(saveTo));

    reader.on('end', function () {
      if (meme.bottom) {
        im.convert(['-background', 'none', '-stroke', 'black', '-fill', 'white', '-gravity', 'center', '-size', '640x100', 'caption:' + meme.bottom, saveTo, '+swap', '-gravity', 'south', '-composite', saveTo],
          function (err, stdout) {
            if (err) console.log(err);
          });
      }

      if (meme.top) {
        im.convert(['-background', 'none', '-stroke', 'black', '-fill', 'white', '-gravity', 'center', '-size', '640x100', 'caption:' + meme.top, saveTo, '+swap', '-gravity', 'north', '-composite', saveTo],
          function (err, stdout) {
            if (err) console.log(err);
          });
      }

      callback(saveTo);
    });
  }
};