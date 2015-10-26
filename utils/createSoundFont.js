var fs = require('fs');
var path = require('path');
var fromDir = process.argv[2];
var toFile = process.argv[3];

if (!fromDir) {
  throw new Error('You must provide a directory where the soundfont files are stored as the first argument');
} else if (!toFile || toFile.indexOf('.json') === -1) {
  throw new Error('You must provide a json file name to store the generated soundfont in (eg soundfont.json)');
}

var soundFont = {};
var allFiles = fs.readdirSync(fromDir);
console.log(allFiles);
for(var i = 0; i < allFiles.length; i++) {
  var filename = allFiles[i];
  var fileWithPath = path.join(fromDir, filename);
  var nextFile = fs.readFileSync(fileWithPath);
  var key = filename.split('.')[0];
  soundFont[key] = nextFile.toString('base64');
}

fs.writeFileSync(toFile, JSON.stringify(soundFont, null, 2));
