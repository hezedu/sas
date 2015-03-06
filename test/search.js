var fs = require('fs');
//var sas = require('../sas');
var sas = require('../sasNoDebug');//去掉了debug，win8 d盘测试，比不去掉节省近1秒

/*
 * 搜索当前硬盘里 所有名为 sas.js 的文件
 * 要求搜索全部，包括 '.' 开头的隐藏文件夹
 * 我用来检测sas性能。
 */

//sas.debug = true;




var find_name = 'sas.js', //寻找的目标
  from = '/';  //从哪个目录开始

var result = [];  //寻找结果
  var file_c1=0;  //文件统计
  var files_c2=0; //文件夹统计



function _fspath(arr,dir) {
  var strtmp = '',
    arr_len = arr.length;
  for (var i = 0; i < arr_len; i++) {
    if (typeof arr[i] === 'string') {
      strtmp += arr[i];
    }
  }
  return dir+'/'+strtmp;
}


function read_dir(cb, t) {

    var fspath =_fspath(t.path,from);

    fs.readdir(fspath, function(err, files) {
      if (err) {  //一些奇怪的文件夹
        console.log('read_dir Err= ' + err);
        return cb();
      }
      var obj = {};
      var len = files.length;
      if(!len){
        return cb();//空文件夹
      }

      for (var i = 0; i < len; i++) {
        var file = files[i];
        
        if (file === find_name) {
          result.push(fspath +'/'+ file); //保存搜索到的结果
        }
        obj['/' + file] = fspath +'/'+ file; //防止跟保留字冲突，前面加 '/';
      }

      t.push(obj);
      cb(fspath);
    });
  }

function _stat(path) {
  return function(cb) {
    fs.stat(path, function(err, stat) {
      if (err) {//一些奇怪的文件
        console.log('_stat Err= ' + err);
        return cb();
      }

      try {  //一些
        if (stat.isDirectory()) {
          files_c2++;
          return cb('$RELOAD', [read_dir]);
        }else{
          file_c1++;
        }
      } catch (e) {
        console.log('catch err =' + e.stack);

      }
      cb(path);

    });
  }
}

var plan = [read_dir];

console.log('开始查找,请稍等...');
console.time('用时');

sas(plan, {
  iterator: _stat, //叠代器
  allEnd:function(){
    console.log('\n=======================');
    console.timeEnd('用时');
    console.log('(包括隐藏文件夹)');
    console.log('文件夹： '+files_c2+'个');
    console.log('文件： '+file_c1+'个');
    console.log('共： '+(file_c1+files_c2)+'个');
    console.log('寻找结果：'+result.length+'个\n'+result.join('\n'));
    console.log('=========完成==============\n');
  }
});





/*
window 对应命令行如：  dir d:\ /a /s | find "mktree.js"
*/