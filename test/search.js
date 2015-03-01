var sas = require('../sas');
var fs = require('fs');

var plan = ['/'];

//1.0
/*function _last(arr){
  return arr[arr.length-1];
}*/
function init(path) {
  return function(cb,ext) {
    fs.stat(path, function(err, stat) {
      if (stat.isDirectory()) {
        
        fs.readdir(path, function(err, files) {
          if (err) {
            cb('$STOP'); //中止退出
          } else {
            for(var i=0,len=files.length;i<len;i++){
              var pathName=path+files[i];
              if(files[i][0]!=='.'){//过滤掉系统/隐藏文件夹
                this[ext.index+1][pathName]=i;
              }
            }
            this[ext.index]=[];//动态生成异步
            cb();
          }
        });
      } else {
          cb();
      }
    });
  }
}