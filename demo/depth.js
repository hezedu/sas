var fs = require('fs');
var sas = require('../index');

function readdir(cb, i) {
  var indexs = i.indexs(), path = indexs.join('') || '/';
  if (indexs.length > this.depth) { //record
    this.depth = indexs.length;
    this.deepestPath = path + '/';
  }
  fs.readdir(path, function(err, files) {
    if (err || !files.length) return cb();
    var obj = {}, len = files.length;
    for (var i = 0; i < len; i++) {
      obj['/' + files[i]] = path + '/' + files[i];
    }
    cb('$reload', obj);
  });
}

function stat(path) { //iterator
  return function(cb) {
    fs.lstat(path, function(err, stat) {
      if (err || stat.isSymbolicLink()) return cb();
      if (stat.isDirectory()) {
        return cb('$reload', readdir);
      }
      cb();
    });
  }
}

console.log('Exploring disk\'s max depth...');
console.time('Time cost');
sas(readdir ,{iterator: stat, context: {depth: 0}}, function(err, result) {
  console.timeEnd('Time cost');
  console.log('Max Depth:' + (result.depth + 1));
  console.log('Deepest path:' + result.deepestPath);
});