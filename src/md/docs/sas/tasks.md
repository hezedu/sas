# sas(<span class="dw-heightlight">tasks</span>)
Tasks可以是任何东西，当它是以下三种type时具有特殊含意:
- **Array[]** 代表串行
- **Object{}** 代表并行
- **Function** 代表task，task第一个参数必须是callback，且callback必须被执行：

```js
function task(callback){
  callback();
}
```
上面的task是同步的，sas可以处理同步task(sas的第一个字母是**S**是sync的意思), 但异步的task才是sas的主要猎物：
```js
function task(callback){
  setTimeout(callback);
}
```
下面的demo将使用这三种type：
### Demo:节省的时间
```js 
var sas = require('sas');
var totalTime = 0, realTime = 0;
// 为了方便，使用下的方法生成task:
function taskGenerator(k){
  return function(callback){
    var time = Date.now();
    setTimeout(function(){
      var costTime = Date.now() - time;
      console.log(k + ' cost time: ' + costTime + 'ms');
      totalTime += costTime;
      callback();
    }, Math.random() * 1000)
  }
}

console.log('start');
var startTime = Date.now();

sas([taskGenerator('s1'), // arrays is series
{ p1:taskGenerator('p1'), // objects is parallel
  p2: taskGenerator('p2')}, 
function(callback){
  var realTime = Date.now() - startTime;
  console.log('end');
  console.log('Tasks\'s total time count: ' + totalTime + 'ms');
  console.log('real time cost: ' + realTime + 'ms');
  console.log('节省时间: ' + (totalTime - realTime) + 'ms');
  callback();
}]);
```
Yeah!你已经不经易间使用了嵌套，callback的深度为2，这是不是很酷？然而这对sas只是最基本的。