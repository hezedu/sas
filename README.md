# Sas 3.0.1
Sas是一个为了解决Javascript回调地狱而设计的可递归的异步控制库，它使用**Array**代表串行，使用**Object**代表并行，使用**Function**代表任务。无限嵌套，递归执行。无论多深，它都能精准的返回你想要的结果。它就是回调地狱终结者。

- 它很小，源代码在包含很多注释和空格的情况下，仍不到200行。
- 它很简单，它只有一个接口：`sas`。
- 它很强大，你可以运行下面的Demo来见识它的威力。

首先你得安装它：`npm install sas`<br>

### Demo: 使用sas寻找磁盘最深处
```js
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
```
这个demo会异步的浏览你硬盘上所有文件/文件夹，找出最深的那个。最后完美结束，并把结果告诉你。<br>
如果你想知道sas是怎么做到的，请访问：[文档](http://127.0.0.1:4000/#/docs/sas/tasks)。

### 前端直接src
在本项目根目录下`./dist`有打包好的文件供前端使用，支持`amd`加载。如果没有amd的话，会暴露到全局一个变量：`sas`。