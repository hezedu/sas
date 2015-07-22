var fs = require('fs');
var sas = require('../sas-debug.js');
var uglify = require('uglify-js');
/*
 *去掉sas-debug.js里  //<DWDEBUG 到 DWDEBUG> 之间的内容
 * 添加一些注释。生成sas.js ， 利用 uglify 压缩sas-min.js文件。
 * 更改readMe版本号.
 *没什么难度可言。
 */

var version = require('../package.json').version;
var date = new Date();
var datearr = []
datearr[0] = date.getFullYear();
datearr[1] = date.getMonth() + 1;
datearr[2] = date.getDate();

//注释
var note = "/*!\n *version:" + version + "  Released: jQuery.Release \n *repository:https://github.com/hezedu/sas\n *by hezedu " + datearr.join('/') + "\n*/\n\n";

var readDebug = function(cb) { //读取 sas-debug.js
  fs.readFile('../sas-debug2.js', 'utf-8', function(err, buffer) {
    if (err) {
      return console.log('ERR:' + err);
    }
    buffer = buffer.replace(/\/\/\<DWDEBUG([\s\S ]*?)DWDEBUG\>/g, '');
    cb(buffer); //将结果保存。
  })
}

var readMe = function(cb) { //读取 README.md
  fs.readFile('../README.md', 'utf-8', function(err, buffer) {
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

    fs.writeFile('../README.md', data, function(err) {
    if (err) {
      return console.log('write err:' + err);
    }
    console.log('sas.js README.md.版本：' + version);
    cb();
  });

  }
  

/*  fs.writeFile('../sas.js', data, function(err) {
    if (err) {
      return console.log('write err:' + err);
    }
    console.log('sas.js制作完成.版本：' + version);
    cb();
  });*/
}

var writePro = function(cb, t) { //生成主文件

  var data = note + t.Sparent[0].readDebug; // Sparent this的第一个sync(数组)父级。

  fs.writeFile('../sas2.js', data, function(err) {
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
  fs.writeFile('../sas-min.js', note + data.code, function(err) {
    if (err) {
      return console.log('write err:' + err);
    }
    console.log('sas-min.js压缩完成.版本：' + version);
    cb();
  });
}
sas([{
  readDebug: readDebug
}, {
  writePro: writePro
  
}]);
