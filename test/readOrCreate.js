var fs = require('fs');
var sas = require('../sas');

/*
 * Read or Create 常见的场景
 *同时读取三个文件，如没有就创建一个新的,并写入一些初始数据。
 */

sas.debug = true;
var dir = __dirname + '/data';
var initData = 'hello';

function readFile(cb, t) {
  var path = dir + t.pIndex + '.txt'; // t 就是 this 
  fs.readFile(path, null, function(err, buffer) {
    if (err) {
      console.log('读取失败:' + err);
      t.push(createFile); // 贪吃蛇模式，如果出错会增加下一步 创建.
      cb(path);
    } else {
      t.parent[t.pIndex] = buffer.toString(); //通过调用父元素直接替换 this;
      cb();
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
      t.parent[t.pIndex] = initData; //成功就返回数据。
      cb();
    }
  });
}
var readOrCreate = [{
    '/readOrCreate1': [readFile],
    '/readOrCreate2': [readFile],
    '/readOrCreate3': [readFile]
  },
  function(cb) {
    console.log(this[0]);
    cb();
  }
];

//对比log,第一次和之后是不同的。

sas(readOrCreate);