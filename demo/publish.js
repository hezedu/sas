var fs = require('fs');
var sas = require('../sas-debug.js');
var uglify = require('uglify-js');
sas.debug=false;
/*
 *去掉sas-debug.js里  //<DWDEBUG 到 DWDEBUG> 之间的内容
 * 添加一些注释。生成sas.js ， 利用 uglify 压缩sas-min.js文件。
 *没什么难度可言。
 */

var version = require('../package.json').version;
var date  = new Date();
var datearr=[]
datearr[0] = date.getFullYear();
datearr[1] = date.getMonth();
datearr[2] = date.getDate();

//注释
var note = "/*!\n *version:"+version+",\n *author:hezedu,\n *Released: jQuery.Released,\n *Date:"+datearr.join('-')+"\n*/\n";

var read = function(cb) { //读取 sas-debug.js
  fs.readFile('../sas-debug.js', 'utf-8', function(err, buffer) {
    if (err) {
      return console.log('ERR:' + err);
    }
    buffer = buffer.replace(/\/\/\<DWDEBUG([\s\S ]*?)DWDEBUG\>/g, '');
    cb(buffer);//将结果保存到this。
  })
}


var writePro = function(cb, t) {//生成主文件

  var data = note+t.Sparent[0]; // Sparent this的第一个sync(数组)父级。

  fs.writeFile('../sas.js', data, function(err) {
    if (err) {
      return console.log('write err:' + err);
    }
    console.log('sas.js制作完成.版本：'+version);
    cb();
  });
}

var writeMin = function(cb, t) {//生成压缩min.js，前端使用
  var data = t.Sparent[0];
  data = uglify.minify(data, {
    fromString: true
  });
  fs.writeFile('../sas-min.js', note+data.code, function(err) {
    if (err) {
      return console.log('write err:' + err);
    }
    console.log('sas-min.js压缩完成.版本：'+version);
    cb();
  });
}
sas([read, {
  writePro: writePro,
  writeMin: writeMin
}]);