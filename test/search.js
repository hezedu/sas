var fs = require('fs');
var sas = require('../sas');

/*
 * 搜索当前硬盘里 所有 *.avi 文件
 * 跟操作系统哪个快
 * 你猜？
 */

sas.debug = true;

function _search(fs_url) {

  return function _stat(cb, t) {
    fs.stat(fs_url, function(err, stat) {
      if (stat.isDirectory()) {
        t.parent[t.pIndex] = [readDir(fs_url)]; //替换当前为数组
        t.reload();
        cb();
      }
    });
  }

}

function readDir(path){
  return function(cb, t) {
    fs.readdir(path, function(err, files) {
      if (err) {
        cb('$STOP');
      } else {
        var obj = {};
        for (var i = 0, len = files.length; i < len; i++) {
          obj[path] = files[i];
        }
      }
      t.push(obj);
      cb();
    });
  }
}


function init(path, opt) {
  opt = opt || {};

  return function(cb, t) {
    fs.stat(path, function(err, stat) {
      t.push
      if (stat.isDirectory()) {
        t.push([path])
          /*        var As_files={
                    ''
                  };*/
          //t.push()
        fs.readdir(path, function(err, files) {
          if (err) {
            cb('$STOP'); //中止退出
          } else {
            for (var i = 0, len = files.length; i < len; i++) {
              var pathName = path + files[i];
              if (opt.all && files[i][0] !== '.') { //是否过滤掉系统 . 开头的文件夹。默认是。
                this[t.index + 1][pathName] = i;
              }
            }
            this[t.index] = []; //动态生成异步
            cb();
          }
        });
      } else {
        cb();
      }
    });
  }
}



var searchAvi = [];

fs.stat('/git', function(err, stat) {
  console.log(JSON.stringify(stat));
  if (stat.isDirectory()) {

    //t.push()
    fs.readdir('/git', function(err, files) {
      if (err) {
        cb('$STOP'); //中止退出
      } else {
        for (var i = 0, len = files.length; i < len; i++) {
          console.log(files[i]);
          /*              var pathName = path + files[i];
                        if (opt.all && files[i][0] !== '.') { //是否过滤掉系统 . 开头的文件夹。默认是。
                          this[t.index + 1][pathName] = i;
                        }*/
        }
        //this[t.index] = []; //动态生成异步
        //cb();
      }
    });
  } else {
    cb();
  }
});