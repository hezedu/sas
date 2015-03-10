var fs = require('fs');
var sas = require('../sas');

/*
 * 找出磁盘最深的地方
 */

var from = '/'; //根目录.
var file_c1 = 0; //文件统计
var files_c2 = 0; //文件夹统计
var deep = 0; //深处
var deepstr = ''; //最深处路径

function read_dir(cb, t) {
  var t_fspath = t.fspath(); //t.fspath()=返回过滤掉t.path里数字的一个新数组。
  var fspath = t_fspath.join('') ||  from;

  if (t_fspath.length > deep) {
    deep = t_fspath.length; //记录最深点
    deepstr = fspath + '/';
  }

  fs.readdir(fspath, function(err, files) {
    if (err) { //一些奇怪的文件夹
      //console.log('read_dir Err= ' + err);
      return cb();
    }
    var obj = {};
    var len = files.length;
    if (!len) {
      return cb(); //空文件夹
    }
    for (var i = 0; i < len; i++) {
      var file = files[i];
      obj['/' + file] = fspath + '/' + file; //防止跟保留字冲突，前面加 '/';
    }
    t.push(obj);//添加任务
    cb();
  });
}

function _stat(path) { //iterator
  return function(cb) {
    fs.lstat(path, function(err, stat) {
      if (err) { //一些奇怪的文件
        return cb();
      }
      if (stat.isSymbolicLink()) { //linux 软链接
        return cb();
      }
      if (stat.isDirectory()) {
        files_c2++;
        return cb('$RELOAD', [read_dir]);
      } else {
        file_c1++;
      }
      cb();

    });
  }
}
console.log('\n\u001b[93m正在查找磁盘最深的地方请稍等……\u001b[39m');
console.log('\u001b[36m包括所有隐藏文件夹\u001b[39m');
if(process.platform.substr(0,3)==='win'){
  console.log('\u001b[90m如果程序初次运行会比较慢，第二次就快了。\u001b[39m\n');
}
console.time('\u001b[91m用时\u001b[39m');

sas([read_dir], { //////核心
  iterator: _stat,
  allEnd: function() {
    console.timeEnd('\u001b[91m用时\u001b[39m');
    console.log('\n文件夹： \u001b[96m' + files_c2 + '\u001b[39m个');
    console.log('文件： \u001b[96m' + file_c1 + '\u001b[39m个');
    console.log('共： \u001b[96m' + (file_c1 + files_c2) + '\u001b[39m个');
    console.log('最深处： \u001b[96m' + (deep + 1) + '\u001b[39m层 (相对于：\u001b[93m' + from + '\u001b[39m)');
    console.log('位于： \u001b[96m' + deepstr + '\u001b[39m');
  }
});