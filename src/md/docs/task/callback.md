# task(<span class="dw-heightlight">callback</span>)
### callback(error, result)
___error-first___：error不存在则为成功。<br>
sas在此第一个参数`error`上基础上扩展二个参数，以**$**开头的字符串：`$up`和`$reload`。
### callback('$up', result)
它将会结束当前层，返回到上一层。跟它同级其它任务未执行的不执行，未返回将会被抛弃。
```js
var sas = require('sas');

function iterator(v){
  return function task(callback){
    setTimeout(function(){
      console.log(v);
      if(v === 'two'){
        callback('$up');
      }else{
        callback();
      }
    }, Math.random() * 1000);
  }
}

sas(['one', 'two', 'three'], {iterator})
//three will never log.
```
#### Demo：淘汰赛
```js
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
```
### callback('$reload'[, tasks])
重载任务，如果`tasks`参数不存在它会重载自身。
#### Demo：命令行数字钟表
```js
var sas = require('sas');
console.log('当前时间');
sas(function(callback){
  setTimeout(function(){
    var date = new Date();
    process.stdout.cursorTo(0);
    process.stdout.write(date.toString());
    callback('$reload');
  }, 1000)
})
```
`tasks`参数存在它会将自身重载为tasks。可参考首页的Demo：寻找磁盘最深处。

