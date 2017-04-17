# sas(tasks, <span class="dw-heightlight">end</span>)
**end**是一个function, 它将在程序结束时执行。带来结果或者得到一个错误。<br>
## end(error, result)
参数遵循___error-first___样式。
### error
只要task的callback传递一个错误，程序将会中止，错误将会出现在end的第一个参数那里。
```js
var sas = require('sas');

// 为了方便演示，使用下的方法生成task:
function taskGenerator(k){
  return function(callback){
    setTimeout(function(){
      if(k === 'error'){
        return callback(new Error('出错了，程序中止'));
      }
      console.log(k);
      callback();
    }, Math.random() * 1000)
  }
}

sas([taskGenerator('one'), 
  taskGenerator('error'),
  taskGenerator('two')],
  function(err){
    console.error(err.message);
});
```
### result
Result将会在之后章节讲到。
