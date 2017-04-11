var sas = require('../index');
var totalTime = 0, realTime = 0;
// 为了方便，使用下的方法生成task:
function taskGenerator(k){
  return function(callback, i){
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

sas([taskGenerator('s1'), 
{ p1:taskGenerator('p1'),
  p2: taskGenerator('p2')}, 
function(callback){
  var realTime = Date.now() - startTime;
  console.log('end');
  console.log('Tasks\'s total time count: ' + totalTime + 'ms');
  console.log('real time cost: ' + realTime + 'ms');
  console.log('节省时间: ' + (totalTime - realTime) + 'ms');
  callback();
}]);