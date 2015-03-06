var fs = require('fs');
var sas = require('../sas');

/*
 * 搜索当前硬盘里 所有名为 sas.js 的文件
 * 要求搜索全部，包括 '.' 开头的隐藏文件夹
 */

sas.debug = true;

var result = [],
  find_name = 'sas.js',
  from = '/';


/*function stat_(files) {
  return function(cb, t) {

    fs.stat(files, function(err, stat) {
      try{
        if(files.isDirectory()){
          t.reload()
        }
      }
    });
  }

}*/



function _search(fs_url) {
 
  return function _stat(cb, t) {
    fs.stat(fs_url, function(err, stat) {
      try {
        if (err) {
          console.log('_stat ' + err);
          return cb(fs_url);
        }

        if (stat.isDirectory()) {
           console.log("fs_url===" + fs_url);
          //t.reload([readDir(fs_url)]); //替换当前为数组,并重载当前任务。

          return cb('$RELOAD');
        }
      } catch (e) {
        cb(fs_url);

      }
      cb(fs_url);
    });
  }
}

function readDir(path) {


  return function(cb, t) {
    fs.readdir(path, function(err, files) {
      if (err) {
        console.log("readDir " + err)
        cb('$STOP');
      } else {
        var obj = {};
        for (var i = 0, len = files.length; i < len; i++) {
          var path_ = (path === '/') ? path : path + '/';
          obj['_' + i] = path_ + files[i];

          if (files[i] === find_name) {
            result.push(t.path.join('/'));
          }
        }
        console.log('path_= ' + path_ + files[i]);
        t.push(obj);
        cb();
      }
    });
  }
}

var search = [readDir(from)];

sas(search, {
  iterator: _search,
  allEnd: function() { //allEnd 在程序完全结束后调用。
    console.log('result='+result.join('\n'));
  }
});