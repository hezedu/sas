var fs = require('fs');
var sas = require('../sas');

/*
 * 搜索当前硬盘里 所有名为 sas.js 的文件
 * 要求搜索全部，包括 '.' 开头的隐藏文件夹
 */

//sas.debug = true;

var result = [],
  find_name = 'sas.js',
  from = 'D:/WWW/rockmongo';

function _fspath(arr) {
  var strtmp = '',
    arr_len = arr.length;
  for (var i = 0; i < arr_len; i++) {
    if (typeof arr[i] === 'string') {
      strtmp += arr[i];
    }
  }
  return strtmp;
}


function read_dir(path) {
  return function(cb, t) {

    var fspath =_fspath(t.path);
   //console.log('\n\nstrtmp' +fspath)
/*    if (t.Sparent) {
      var ts0 = t.Sparent[0];
      ts0 = ts0 === '/' ? '' : ts0;
      path = ts0 + path;
    }*/
    //var _path = (path === '/') ? path : path + '/';
    fspath= fspath || '/';
    fs.readdir(fspath, function(err, files) {
      if (err) {
        console.log('read_dir Err= ' + err);
        return cb('$end');
      }
      var obj = {};

      for (var i = 0, len = files.length; i < len; i++) {
        var file = files[i];
        if (file === find_name) {
          result.push[fspath +'/'+ file];
        }
        obj['/' + file] = fspath +'/'+ file;
      }

      t.push(obj);
      cb(fspath);
    });
  }
}

function _stat(path) {
  return function(cb, t) {
    fs.stat(path, function(err, stat) {
      if (err) {
        console.log('read_dir Err= ' + err);
        return cb('$end');
      }
      console.log('path=='+path);
      try {
        if (stat.isDirectory()) {
          /*          t.reload([read_dir(path)]); //替换当前为数组,并重载当前任务。

                    return cb('$RELOAD');*/
          //t.reload([read_dir(path)]); //替换当前为数组,并重载当前任务。

          return cb('$RELOAD', [read_dir(path)]);
        }
      } catch (e) {
        console.log('catch err =' + e.stack);

      }
      cb(path);

    });
  }
}

//read_dir(from)(function(){},{})
var plan = [read_dir(from)];
sas(plan, {
  iterator: _stat,
  allEnd:function(){
    console.log('\n '+result);
  }
})