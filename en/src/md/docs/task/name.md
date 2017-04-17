#  <span class="dw-heightlight">task</span>(callback)
### name
If the name of the **task** starts with `$`, callback's `result` Will be automatically added to `this`。
### Demo：Get your own file content
```js
var fs = require('fs');
var sas = require('sas');
var path = process.mainModule.filename //The current file path

//Arrow function is imitation can not ask the context of the task, but it can be passed in the results.
var $currFile = cb => fs.readFile(path, 'utf-8', cb);

sas([$currFile,
  function(callback){
    console.log(this.currFile); // The code for the current page will be output
    callback();
  }]);
```
