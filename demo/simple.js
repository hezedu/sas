var sas = require('../dev');
function iterator(v){
  return function(callback){
    setTimeout(function(){
      console.log('v', v);
      callback(null, v.toUpperCase());
    }, Math.random() * 1000);
  }
}

sas(['Seq start',
{one: 'Parallel 1', two: 'Parallel 2'}, 
  'Seq end'],
iterator, function(err, result){
  console.log(result);
});