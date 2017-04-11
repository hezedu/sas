# task(<span class="dw-heightlight">callback</span>)
### callback(error, result)
国际惯例：callback第一个参数为error, 不存在为成功。sas在此基础上扩展二个参数：以**$**开头的字符串，`$up`和`$reload`。
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

```js
var sas = require('sas');

function iterator(v){
  return function $first(callback){
    setTimeout(function(){
      callback('$up', v);
    }, Math.random() * 1000);
  }
}

sas({p1: 'player 1', p2: 'player 2', p3: 'player 3'}, 
iterator, function(err, result){
  console.log('Winner is ', result.first);
})
```
### callback('$reload'[, tasks])
重载任务，如果`tasks`参数不存在它会重载自身。
#### Demo；命令行钟表
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

