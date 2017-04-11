var fs = require('fs');
var sas = require('../index');

function readdir(cb, i) {
  var indexs = i.indexs(), path = this.dir + indexs.join('/');
  if (indexs.length > this.depth) { //record
    this.depth = indexs.length;
    this.deepestPath = path;
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
sas(readdir ,{iterator: stat, context: {depth: 0, dir: '/'}}, function(err, result) {
  console.log('Deepest depth:',  result.depth);
  console.log('Deepest path:', result.deepestPath);
  console.timeEnd('time cost');
});