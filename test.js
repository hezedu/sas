var sas = require('sas');

function iterator(v){
  return function $first(callback){
    var self = this;
    setTimeout(function(){
      if(!self.first){
        console.log(v + '是第一名。');
        callback('$up', v);
      }else{
        console.log(v + '被淘汰了。');
        callback();
      }
      
    }, Math.random() * 1000);
  }
}
console.log('比赛开始');
sas({p1: '小明', p2: '小刚', p3: '小刘'}, 
iterator, function(err, result){
  console.log('获胜者为： ', result.first);
})