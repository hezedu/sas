var fs = require('fs');
var sas = require('../sas-debug');

/*
 * Read or Create 常见的场景
 *同时读取三个文件，如没有就创建一个新的,并写入一些初始数据。
 */

var dir = __dirname + '/data';//要读取的目录
var initData = 'hello';//初始化的数据。


function readFile(cb, t) {
  var path = dir + t.pIndex;
  fs.readFile(path, null, function(err, buffer) {
    if (err) {
      console.log('读取失败:' + err);
      t.push(createFile); // 贪吃蛇模式，如果出错会增加下一步 创建.
      cb(path);
    } else {
      cb('$THIS=',buffer.toString());//$THIS=  直接替换this.
    }
  });
}

function createFile(cb, t) {
  var path = this[0];
  fs.writeFile(path, initData, null, function(err) {
    if (err) {
      console.log('createFile err:' + err);
      cb('$STOP'); //错误就中止sas
    } else {
      console.log('创建文件：'+path);
      cb('$THIS=',initData);
    }
  });
}

var readOrCreate = [{
    '/readOrCreate1.txt': [readFile],
    '/readOrCreate2.txt': [readFile],
    '/readOrCreate3.txt': [readFile]
  },
  function(cb) {
    console.log('获取成功。');
    console.log(this);
    cb();
    
  }
];


sas(readOrCreate);