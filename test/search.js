var fs = require('fs');
var sas = require('../sasNoDebug'); //去掉了debug，win8 d盘测试，比不去掉节省近1秒

/*var sas = require('../sas');
sas.debug = true; */

/*
 * 搜索当前硬盘里 所有名为 sas.js 的文件
 * 要求搜索全部，包括 '.' 开头的隐藏文件夹
 * 检测sas性能。
 */







var find_name = 'sas.js', //顺带搜索的目标
  from = '/'; //从哪个目录开始
  //from = 'D:/git/sas'; 

var result = []; //搜索结果
var file_c1 = 0; //文件统计
var files_c2 = 0; //文件夹统计



function _fspath(arr, dir) {
  var strtmp = '',
    arr_len = arr.length;
  for (var i = 0; i < arr_len; i++) {
    if (typeof arr[i] === 'string') {
      strtmp += arr[i];
    }
  }
  return dir + '/' + strtmp;
}



function read_dir(cb, t) {

  var fspath = _fspath(t.path, from);

  fs.readdir(fspath, function(err, files) {
    if (err) { //一些奇怪的文件夹
      console.log('read_dir Err= ' + err);

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
      if(stat.isSymbolicLink()){//linux坑 软链接
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
      cb('lstat');

    });
  }
}

var plan = [read_dir];

console.log('\n在 \u001b[93m' + from + '\u001b[39m 目录下开始查找所有的 \u001b[91m' + find_name + '\u001b[39m');
console.log('\u001b[36m包括所有隐藏文件夹\u001b[39m');
console.log('\u001b[91m正在建立索引\u001b[39m，正在查找，请稍等……');
console.time('\u001b[91m用时\u001b[39m');

sas(plan, { //////核心
  iterator: _stat,
  allEnd: function() {
    
    console.timeEnd('\u001b[91m用时\u001b[39m');
    console.log('\n文件夹： \u001b[96m' + files_c2 + '\u001b[39m个');
    console.log('文件： \u001b[96m' + file_c1 + '\u001b[39m个');
    console.log('共： \u001b[96m' + (file_c1 + files_c2) + '\u001b[39m个');
    console.log('\n=======================');
    console.log('搜索结果：' + result.length + '个\n' + result.join('\n'));
    console.log('=======================\n');
    console.log('\n\u001b[93m' + from + '\u001b[39m \u001b[91m目录下所有文件索引已建立!\u001b[39m\n');
    console.log('再次搜索看看是不是变快了？ ');
    research();

/*        
        //输出到文件
        fs.writeFile('./index.json', JSON.stringify(plan), null, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('\u001b[91m index.json \u001b[39m索引文件已完成。');
            process.stdin.end();
          }
        })*/

  }
});



function research() {


  process.stdin.read();

  process.stdin.on('data', function(chunk) {

    var search_name = '/' + chunk.toString(),
      result2 = [];
      var last_len = process.platform ==='linux' ? 1 : 2; //window 下换行为2 linux为1 
    search_name = search_name.substr(0, search_name.length - last_len); 
    console.log("process.platform===" + process.platform);

    console.log('在 \u001b[93m' + from + '\u001b[39m 目录下开始查找所有的 \u001b[91m' + search_name.substr(1) + '\u001b[39m');

    console.log('正在查找，请稍等……');

    console.time('\u001b[91m建索引后用时\u001b[39m');
    sas(plan, {
      iterator: _search,
      allEnd: function() {
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

        //research();
      }
    });

    function _search(str) {
      return function(cb, t) {
        var filename = t.index;
        if (!str) { //目录
          filename = t.pIndex;
        }
        //console.log('filename=='+filename)
        if (filename === search_name) {
          result2.push(_fspath(t.path, from));
        }
        cb(str);
      }
    }

  });



}


//'\u001b[' + c + 'm' + str + '\u001b[' + b + 'm'

/*
*简单的测试了下，我这边的情况是这样的：

*测试环境：老XP 32位。双核 2G内存  D：盘。由本程序统计共： 121435个文件。
*window 对应命令行如：  dir d:\ /a /s | find "sas.js"

*测试结果，当前在没有索引的情况下，9782ms , 比系统慢， 有索引的情况 1671ms ;下差不多一样快。
*当然win系统还匹配名字里带搜索字的，而我只简单匹配的是全名。
*因此不是很准。

*测试环境2：linux 64位。单核。1G内存  根目录  由本程序统计共： 164874个文件。
*linux下也测试通过了。没建索引 11403ms 建了之后 2441ms 情况跟win 差不多。
*但对linux文件系统不太熟，只用了命令 find / -name "sas.js" 做的对比。 比我的快的多了。
*
*当然sas.js 可以优化的地方还有很多，比如那个索引感觉就是渣。
*
*/