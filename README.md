English [中文](README-cn.md)
# Sas
Sas is a can be recursive asynchronous library of Javascript. It is designed to solve the callback hell. 
It use Array delegate series, use Object delegate parallel, use Function delegate task. Series and parallel can unlimited nesting, It will recursive execution. no matter how deep, can accurate return to the results you want. It is callback hell terminator.
- It is very small, the source code contains a lot of comments and spaces in the case, still less than 200 lines.
- It is very simple, it has only one interface: `sas`.
- It is very powerful, you can run the following Demo to see its power.

First you have to install it:`npm install sas`<br>

### Demo: Disk Depth Explorer:
```js
var fs = require('fs');
var sas = require('sas');
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
```
This demo will browse all the files / folders on your hard drive asynchronously, find the deepest path, and tell you the results<br>
If you want to know how **sas** is done, please visit:[Docs](https://hezedu.github.io/sas/#/docs/sas/tasks)。

### Front-end direct src
In the root directory of the project `. / Dist` has some wrapped files for the front-end use, support` amd` load. If there is no amd, it will be exposed to a global variable:` sas`.

#### browser
IE8 and below are not supported.
