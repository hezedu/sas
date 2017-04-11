var fs = require('fs');
var sas = require('../index');
var rootDir = '/', depth = 0, deepestPath;

function readdir(cb, i) {
  var indexs = i.indexs(), path = rootDir + indexs.join('/');
  if (indexs.length > depth) { //record
    depth = indexs.length;
    deepestPath = path;
  }
  fs.readdir(path, function(err, files) {
    if (err || !files.length) return cb();
    var tasks = {}, i = 0, len = files.length;
    for (; i < len; i++) {
      tasks[files[i]] = path + '/' + files[i];
    }
    cb('$reload', tasks);
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

console.log('Exploring disk\'s deepest depth...');
console.time('time cost');

sas(readdir ,stat, function() {
  console.log('Deepest depth:',  depth);
  console.log('Deepest path:', deepestPath);
  console.timeEnd('time cost');
});