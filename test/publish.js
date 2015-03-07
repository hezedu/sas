var fs = require('fs');
var sas =require('../sas-debug.js');
sas.debug = true;
/*
  *去掉sas-debug.js里  //<DWDEBUG 到 DWDEBUG> 之前的内容,生成sas.js。
  *没什么难度可言。
*/

var read=function(cb) {
  fs.readFile('../sas-debug.js', 'utf-8', function(err, buffer) {
    if (err) {
      return console.log('ERR:' + err);
    }
    buffer = buffer.replace(/\/\/\<DWDEBUG([\s\S ]*?)DWDEBUG\>/g, '');
    cb(buffer);
  })
}
var write=function(cb){
  fs.writeFile('../sas.js',this[0],function(err){
    if(err){
      return console.log('write err:'+err);
    }
    console.log('制作完成');
    cb();
  });
}
sas([read,write]);
