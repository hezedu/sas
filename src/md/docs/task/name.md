#  <span class="dw-heightlight">task</span>(callback)
### name
如果**task**的名字是以`$`开头的话，`callback`返回的结果`result`将会自动添加到`this`里。
### Demo：获取自身文件内容
```js
var fs = require('fs');
var sas = require('sas');
var path = process.mainModule.filename //当前文件路径

//箭头函数是仿问不到task的上下文的，但确可以把结果传过去。
var $currFile = cb => fs.readFile(path, 'utf-8', cb);

sas([$currFile,
  function(callback){
    console.log(this.currFile);//将会输出当前页的代码
    callback();
  }]);
```
