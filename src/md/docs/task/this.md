<big>**task**</big>的上下文并不是你表面看到的那样，通常它被替换成了一个空的对象，或者你可以通过`optitons.context`来初始化它。<br>
所有的task的`this`都指向它。这样无论多深，你都可以方便的仿问到数据。<br>
`end`的第二个参数就是它。
```js
var sas = require('sas');

sas([function(callback){
    console.log(this) //输出:{}
    callback();
}])

sas([function(callback){
    console.log(this); //输出:{hello: 'world'}
    callback();
}], {context: {hello: 'world'}})

sas([
    function(callback){
        this.hello = 'world'
        callback();
    }, 
    {p:[{p:[
    function(callback){
          console.log(this.hello); //输出:'world'
          callback();
    }
    ]}]}]);
```