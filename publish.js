var fs = require('fs');
var sas = require('./debug.js');
var uglify = require('uglify-js');
/*
 *去掉dev.js里  //<DWDEBUG 到 DWDEBUG> 之间的内容
 * 生成index.js 
 * warp前端 dist下生成三文件: sas-dev.js, sas.js, sas-min.js(利用uglify压缩)
 * 更改README版本号.
 */

var version = require('./package.json').version;
var date = new Date();
var dateArr = [date.getFullYear(), date.getMonth() + 1, date.getDate()];

//注释
var note = 
"/*!\n *version: " + version + 
"\n *Released: MIT" + 
"\n *Repository: https://github.com/hezedu/sas" + 
"\n *By dw " +
dateArr.join('/') + 
"\n*/";

// var readDev = (cb, i) => {
//   fs.readFile('./dev.js', 'utf-8', cb);
//   cb.success = buffer => buffer.replace((\n?)/\/\/\<DWDEBUG([\s\S ]*?)DWDEBUG\>(\n?)/g, '');
// } 


var readDebug = function(cb) { //读取 sas-debug.js
  fs.readFile('./dev.js', 'utf-8', function(err, buffer) {
    if (err) {
      return console.log('ERR:' + err);
    }
    buffer = buffer.replace(/((\n)+)(\s*)\/\/\<DWDEBUG([\s\S ]*?)DWDEBUG\>((\n)+)/g, '\n');
    cb(buffer); //将结果保存。
  })
}

var readMe = function(cb) { //读取 README.md
  fs.readFile('./README.md', 'utf-8', function(err, buffer) {
    if (err) {
      return console.log('ERR:' + err);
    }
    //buffer = buffer.replace(/\/\/\<DWDEBUG([\s\S ]*?)DWDEBUG\>/g, '');
    cb(buffer); //将结果保存。
  })
}
var writeMe = function(cb, t) { //更新 readMe首部 版本号

  var data = t.Sparent[0].readMe;
  var first_n = data.indexOf('\n');
  var top = data.substr(0,first_n);

  top = top.split('sas');
  if(top[1] == version){
    cb();
  }else{
    top[1] = version;
    top = top.join('sas');
    data = top+data.substr(first_n);

    fs.writeFile('./README.md', data, function(err) {
    if (err) {
      return console.log('write err:' + err);
    }
    console.log('sas.js README.md.版本：' + version);
    cb();
  });

  }
  

/*  fs.writeFile('./sas.js', data, function(err) {
    if (err) {
      return console.log('write err:' + err);
    }
    console.log('sas.js制作完成.版本：' + version);
    cb();
  });*/
}

var writePro = function(cb, t) { //生成主文件

  var data = note + t.Sparent[0].readDebug; // Sparent this的第一个sync(数组)父级。

  fs.writeFile('./index.js', data, function(err) {
    if (err) {
      return console.log('write err:' + err);
    }
    console.log('sas.js制作完成.版本：' + version);
    cb();
  });
}

var writeMin = function(cb, t) { //生成压缩min.js，前端使用
  var data = t.Sparent[0].readDebug;
  data = uglify.minify(data, {
    fromString: true
  });
  fs.writeFile('./sas-min.js', note + data.code, function(err) {
    if (err) {
      return console.log('write err:' + err);
    }
    console.log('sas-min.js压缩完成.版本：' + version);
    cb();
  });
}
sas([{
  readDebug: readDebug,
  readMe: readMe
}, {
  writeMe: writeMe,
  writePro: writePro,
  writeMin: writeMin
  
}]);
