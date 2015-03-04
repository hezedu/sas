var sas = require('../sas');
var fs = require('fs');

/*
 *读取一个文件，如没有创建一个新的,并写入一些数据.  Read or Create
 */

var dir =__dirname+'/data';

function readFile(cb, ext) {
  var path = dir + ext.pIndex; // ext.pIndex = this的index.
  fs.readFile(path, null, function(err, buffer) {
    if (err) {
      console.log('err' + err);
      ext.parent[ext.pIndex].push(createFile); //如果出错下一步创建.
      cb(path);
    } else {
      console.log('2222');
      ext.parent[ext.pIndex] = buffer; //通过调用父元素直接替换 this , 后面必须 cb('$END');
    }
  });
}

var initData = 'hello';

function createFile(cb) {
  var path = this[0];
  fs.writeFile(path, initData, null, function(err) {
    if (err) {
      console.log('createFile err' + err);
      return cb('$STOP'); //中止sas
    } else {
      cb(initData);
    }
  });
}

var readOrcreate = [{
    '/test1': [readFile],
    '/test2': [readFile],
    '/test3': [readFile]
  },
  function(cb) {
    console.log(this[0]);
    cb();
  }
];

sas(readOrcreate);