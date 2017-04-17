# task(<span class="dw-heightlight">callback</span>)
### callback(error, result)
___ error-first ___ style. If the error exists, the program will end. Unless it is a magic string:
<br>
Sas extends the two magic string on the first params. `$up` and `$reload`.
### callback('$up', result)
It will end the current layer and return to the previous layer. Sibling tasks
Sibling tasks Not executed will be no executed, no callbacked will be abandoned.
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
#### Demo：Knockout
```js
var sas = require('sas');

function iterator(v){
  return function $first(callback){
    var self = this;
    setTimeout(function(){
      if(!self.first){
        console.log(v + ' is the first.');
        callback('$up', v);
      }else{
        console.log(v + ' be eliminated.');
        callback();
      }
      
    }, Math.random() * 1000);
  }
}
console.log('start');
sas({p1: 'John', p2: 'Tom', p3: 'Lee'}, 
iterator, function(err, result){
  console.log('Winner: ', result.first);
})
```
### callback('$reload'[, tasks])
Reload task, if the `tasks` param does not exist it will put itself.
#### Demo：Command line digital watch
```js
var sas = require('sas');
console.log('current time');
sas(function(callback){
  setTimeout(function(){
    var date = new Date();
    process.stdout.cursorTo(0);
    process.stdout.write(date.toString());
    callback('$reload');
  }, 1000)
})
```
`tasks` param exists that it will reload tasks. You can refer to the home page Demo.

