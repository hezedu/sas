# sas(tasks, <span class="dw-heightlight">options</span>, end)
### iterator(value)
Iterator like the previous `taskGenerator`, It will handle all non-"Array", "Object" and "Function" types' **value** in the tasks.<br>
It must return a `task`。<br>
`sas(tasks, iterator, end)` equivalent to `sas(tasks, {iterator: iterator}, end)` 
### .process(tasksCount, tasksCbCount)
`tasksCount`：All the current number of executed tasks.
`tasksCbCount`：All the current number of callbacked tasks.
### .processInterval
Process execution interval, default `1000`.
### Demo: Command line digital progress display
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
    console.log('I am a native Task.');
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
The default context of the task, default is `{}`, see the next section.