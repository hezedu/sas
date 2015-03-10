var fs = require('fs');
var sas = require('../sas');
/*
var sas = require('../sas-debug');
sas.debug=false;
 */
/*
 * 搜索当前硬盘里 所有名为 sas.js 的文件
 * 要求搜索全部，包括 '.' 开头的隐藏文件夹
 * 检测sas性能。
 */

var find_name = 'sas.js', //顺带搜索的目标
  from = '/'; //从哪个目录开始,默认是当前整个硬盘。
//from = 'D:/git/sas';

var from2 = (from[from.length - 1] === '/') ? from.substr(0, from.length - 1) : from; //trim掉后面的/;


var result = []; //搜索结果
var file_c1 = 0; //文件统计
var files_c2 = 0; //文件夹统计
var index2 = {}; //索引存放处
var deep = 0;//深处
var deepstr = '';//最深处

function read_dir(cb, t) {
  var t_fspath = t.fspath();

  var fspath = from2 + t_fspath.join('') || from2 || from; //t.fspath()=返回过滤掉t.path里数字的一个新数组。

      if(t_fspath.length>deep){
        deep = t_fspath.length;
        deepstr = fspath+'/';
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

      if (file === find_name) {
        result.push(fspath + '/' + file); //保存搜索到的结果
      }
      obj['/' + file] = fspath + '/' + file; //防止跟保留字冲突，前面加 '/';
      index2[fspath + '/' + file] = file;
    }

    t.push(obj);
    cb();
  });
}

function _stat(path) {
  return function(cb) {
    fs.lstat(path, function(err, stat) {
      if (err) { //一些奇怪的文件
        //console.log('_stat Err= ' + err);
        return cb();
      }
      if (stat.isSymbolicLink()) { //linux 软链接
        return cb();
      }
      //try {  //一些
      if (stat.isDirectory()) {
        files_c2++;
        return cb('$RELOAD', [read_dir]);
      } else {
        file_c1++;
      }
      /*      } catch (e) {
              console.log('catch err =' + e.stack);

            }*/
      cb();

    });
  }
}

var plan = [read_dir];

console.log('\n在 \u001b[93m' + from + '\u001b[39m 目录下开始查找所有的 \u001b[91m' + find_name + '\u001b[39m');
console.log('\u001b[36m包括所有隐藏文件夹\u001b[39m');
console.log('\u001b[91m正在建立索引\u001b[39m，正在查找，请稍等……');
if(process.platform.substr(0,3)==='win'){
  console.log('\u001b[90m如果程序初次运行会比较慢，第二次就快了。\u001b[39m\n');
}
console.time('\u001b[91m用时\u001b[39m');

sas(plan, { //////核心
  iterator: _stat,
  allEnd: function(err, plan) {

    //这里err 肯定是null，因此不用判断了。

    console.timeEnd('\u001b[91m用时\u001b[39m');
    console.log('\n文件夹： \u001b[96m' + files_c2 + '\u001b[39m个');
    console.log('文件： \u001b[96m' + file_c1 + '\u001b[39m个');
    console.log('共： \u001b[96m' + (file_c1 + files_c2) + '\u001b[39m个');
    console.log('最深处： \u001b[96m' + (deep+1) + '\u001b[39m层 (相对于：\u001b[93m'+from+'\u001b[39m)');
    console.log('位于： \u001b[96m' + deepstr + '\u001b[39m');
    console.log('\n=======================');
    console.log('搜索结果：' + result.length + '个\n' + result.join('\n'));
    console.log('=======================\n');
    console.log('\n\u001b[93m' + from + '\u001b[39m \u001b[91m目录下所有文件索引已建立!\u001b[39m\n');
    console.log('再次搜索看看是不是变快了？ ');
    //research();
    research2();

    //输出到文件
    /*    fs.writeFile('./index.json', JSON.stringify(index2), null, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('\u001b[91m index.json \u001b[39m索引文件已完成。');
            process.stdin.end();
          }
        })*/

  }
});

function research2() { //在建立索引的情况下搜索

  process.stdin.read();

  process.stdin.on('data', function(chunk) {
    var search_name = chunk.toString(),
      result2 = [];
    var last_len = process.platform === 'linux' ? 1 : 2; //window 下换行为2 linux为1 
    search_name = search_name.substr(0, search_name.length - last_len);
    console.log('search_name==' + search_name)

    console.log('在 \u001b[93m' + from + '\u001b[39m 目录下开始查找所有的 \u001b[91m' + search_name + '\u001b[39m');

    console.log('正在查找，请稍等……');

    console.time('\u001b[91m建索引后用时\u001b[39m');
    //console.log(JSON.stringify(index2));

    for (var i in index2) {
      if (index2[i] === search_name) {
        result2.push(i);
      }
    }
    console.timeEnd('\u001b[91m建索引后用时\u001b[39m');
    if (!result2.length) {
      console.log('搜索结果为：空');
    } else {
      console.log('\n=======================');
      console.log('搜索结果：' + result2.length + '个\n' + result2.join('\n'));
      console.log('=======================\n');
    }
    console.log('\n继续搜索:');
    process.stdin.resume();
  });
}


/*function _fspath(arr, dir) {
  var strtmp = '',
    arr_len = arr.length;
  for (var i = 0; i < arr_len; i++) {
    if (typeof arr[i] === 'string') {
      strtmp += arr[i];
    }
  }
  return dir + '/' + strtmp;
}*/