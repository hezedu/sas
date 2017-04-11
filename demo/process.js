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
  {nativeTask: nativeTask}
];

function _process(tasksCount, tasksCbCount){
    process.stdout.cursorTo(0);
    process.stdout.write(tasksCbCount + '/' + tasksCount);
}

for(var i = 0; i < 100; i++){
  tasks.push(i);
}
console.log('start:');
sas(tasks, {iterator:iterator, process: _process}, function(){
  console.log('\nend');
});