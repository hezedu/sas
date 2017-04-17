# sas(<span class="dw-heightlight">tasks</span>)
The task can be anything that has a special meaning when it is the following three types:
- **Array[]** delegate series
- **Object{}** delegate parallel
- **Function** delegate task, first param of the task must be a callback, and the callback must be executed:

```js
// A basic synchronization task
function task(callback){
  callback();
}
```
Sas can handle the synchronization task (sas the first letter S is the meaning of sync), but the asynchronous task is sas the main prey:
```js
//A simple asynchronous task
function task(callback){
  setTimeout(callback)
}
```
The following demo will use these three types:
### Demo: Save Time
```js 
var sas = require('sas');
var totalTime = 0, realTime = 0;

// For convenience, use the following method to generate task:
function taskGenerator(k){
  return function task(callback){
    var time = Date.now();

    setTimeout(function(){
      var costTime = Date.now() - time;
      console.log(k + ' cost: ' + costTime + 'ms');
      totalTime += costTime;
      callback();
    }, Math.random() * 1000)
  }
}

function seriesEnd(callback){
  var realTime = Date.now() - startTime;
  console.log('end');
  console.log('Callbacks time count: ' + totalTime + 'ms');
  console.log('Real time cost: ' + realTime + 'ms');
  console.log('Saved time: ' + (totalTime - realTime) + 'ms');
  callback();
}

console.log('start');
var startTime = Date.now();

sas([ // arrays is series
  taskGenerator('series'), {
    P1: taskGenerator('parallel 1'), // objects is parallel
    P2: taskGenerator('parallel 2')
  }, seriesEnd
]);
```
Did you notice, this Demo is nesting, the callback depth is 2. Ain't it cool? However, this is only the most basic sas.