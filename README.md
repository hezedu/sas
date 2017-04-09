# Sas 3.0.0 建设中...
Sas is the callback hell terminator.<br>
How to prove it?

**Install:**`npm install sas`,<br>
and run the next demo.
### Demo: Disk's max depth explorer
```js
var fs = require('fs');
var sas = require('sas');

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

console.log('Exploring disk\'s max depth...');
console.time('Time cost');
sas(read_dir ,stat, function() {
  console.timeEnd('Time cost');
  console.log('Max Depth:' + (depth + 1));
  console.log('Deepest path:' + deepestPath);
});
```
This demo explores all the folders and files in you disk asynchronously, Record the maximum depth,
and have a good ending to return to your results.<br>
Can other ways to achieve it in the 40 line code? if have please tell me.<br>

If you want to know how **Sas** did it, please visit<br>
docs: https://hezedu.github.io/sas/
