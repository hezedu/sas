#  <span class="dw-heightlight">task</span>(callback)
### name
Task的名字如果是以`$`开头的话，callback的`result`会以Task的名字去掉**$**的key出现在`this`里。

### Demo：获取自身文件内容
```js
var fs = require('fs');
var sas = require('sas');
var path = process.mainModule.filename //当前文件路径

var $currFile = cb => fs.readFile(path, 'utf-8', cb);

sas([$currFile,
  function(callback){
    console.log(this.currFile);//将会输出当前页的代码
    callback();
  }]);
```
