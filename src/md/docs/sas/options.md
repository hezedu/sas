# sas(tasks, <span class="dw-heightlight">options</span>, end)
### iterator(value)
就像前面的`taskGenerator`, 它将会处理tasks里所有非`Array`,`Object`和`Function`类型的 **value**。<br>
它必须return一个`task`。<br>
`sas(tasks, iterator, end)` 相当于 `sas(tasks, {iterator: iterator}, end)` 
### .process(tasksCount, tasksCbCount)
`tasksCount`：当前所有task数。
`tasksCbCount`：当前已完成的task数。
### .processInterval
process执行间隔，默认`1000`。
### Demo: 命令行数字式进度显示
```js
var sas = require('sas');

function iterator(v){
  return function(callback){
    setTimeout(callback, Math.random() * 100)
  }
}

function nativeTask(callback){
   setTimeout(function(){
     callback();
    console.log('我是一个原生的Task.');
  }, Math.random() * 100)
}

var tasks = [
  {nativeTask}
];

function _process(tasksCount, tasksCbCount){
    process.stdout.cursorTo(0);
    process.stdout.write(tasksCbCount + '/' + tasksCount);
}

for(var i = 0; i < 100; i++){
  tasks.push(i);
}
console.log('start:');
sas(tasks, {iterator, process: _process}, function(){
  console.log('\nend');
});
```
### .context
Task的初始上下文，默认`{}`，详见下一节。

