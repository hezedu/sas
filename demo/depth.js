var fs = require('fs');
var sas = require('../index');

var rootDir = '/', depth = 0, deepestPath = '';

function read_dir(cb, i) {
  var indexs = i.indexs(), path = indexs.join('') || rootDir;
  if (indexs.length > depth) { //record
    depth = indexs.length; 
    deepestPath = path + '/';
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
        return cb('$reload', read_dir);
      }
      cb();
    });
  }
}

console.log('exploring disk\'s depth...');
console.time('Time cost');
sas(read_dir ,stat, function() {
    console.timeEnd('Time cost');
    console.log('Depth:' + (depth + 1));
    console.log('Deepest path:'+ deepestPath);
});