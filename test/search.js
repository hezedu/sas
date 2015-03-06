var fs = require('fs');
var sas = require('../sas');

/*
 * 搜索当前硬盘里 所有名为 sas.js 的文件
 * 要求搜索全部，包括 '.' 开头的隐藏文件夹
 */

//sas.debug = true;




var find_name = 'mktree.js', //寻找的目标
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


function read_dir(path) {
  return function(cb, t) {

    var fspath =_fspath(t.path,from);
    //console.log("fspath=" + fspath);
    //fspath= fspath || '/';
    fs.readdir(fspath, function(err, files) {
      if (err) {  //一些奇怪的文件夹
        //console.log('read_dir Err= ' + err);
        return cb('$end');
      }
      var obj = {};
      var len = files.length;
      if(!len){
        return cb('$end');//空文件夹
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
}

function _stat(path) {
  return function(cb, t) {
    fs.stat(path, function(err, stat) {
      if (err) {//一些奇怪的文件
        //console.log('read_dir Err= ' + err);
        return cb('$end');  
      }

      //try {  //一些
        if (stat.isDirectory()) {
          files_c2++;
          return cb('$RELOAD', [read_dir(path)]);
        }else{
          file_c1++;
        }
/*      } catch (e) {
        console.log('catch err =' + e.stack);

      }*/
      cb(path);

    });
  }
}

var plan = [read_dir(from)];

console.time('用时');

sas(plan, {
  iterator: _stat,
  allEnd:function(){
    console.log('\n=======================');
    console.timeEnd('用时');
    console.log('(包括隐藏文件夹)');
    console.log('文件夹： '+files_c2+'个');
    console.log('文件： '+file_c1+'个');
    console.log('共： '+(file_c1+files_c2)+'个');
    console.log('寻找结果：'+result.length+'个\n'+result.join('\n'));
    console.log('=======================\n');
  }
});
/*
window 对应命令行如：  dir d:\ /a /s | find "mktree.js"
*/