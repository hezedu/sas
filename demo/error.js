var sas = require('../index');
function taskGenerator(k){
  return function(callback){
    setTimeout(function(){
      if(k === 'error'){
        return callback(new Error('出错了，程序中止'))
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