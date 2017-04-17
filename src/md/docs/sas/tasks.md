# sas(<span class="dw-heightlight">tasks</span>)
Tasks可以是任何东西，当它是以下三种type时具有特殊含意:
- **Array[]** 代表串行
- **Object{}** 代表并行
- **Function** 代表task，task第一个参数必须是callback，且callback必须被执行：

```js
//一个基本的同步task
function task(callback){
  callback();
}
```
sas可以处理同步task(sas的第一个字母**S**就是sync的意思), 但异步的task才是sas的主要猎物：
```js
//一个简单的异步task
function task(callback){
  setTimeout(callback)
}
```
下面的demo将使用这三种type：
### Demo:节省的时间
```js 
var sas = require('sas');
var totalTime = 0, realTime = 0;

// 为了方便，使用下的方法生成task:
function taskGenerator(k){
  return function task(callback){
    var time = Date.now();

    setTimeout(function(){
      var costTime = Date.now() - time;
      console.log(k + ' 用时：' + costTime + 'ms');
      totalTime += costTime;
      callback();
    }, Math.random() * 1000)
  }
}

function seriesEnd(callback){
  var realTime = Date.now() - startTime;
  console.log('end');
  console.log('所有callback时间：' + totalTime + 'ms');
  console.log('实际用时: ' + realTime + 'ms');
  console.log('节省时间: ' + (totalTime - realTime) + 'ms');
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
Yeah!你已经不经易间使用了嵌套，callback的深度为2，这是不是很酷？然而这对sas只是最基本的。