**Task**的上下文并不是你看到的表面那样，通常它被替换成了一个空的对象，你可以通过`optitons.context`来初始化它。
所有的task的`this`都指向它。这样无论多深，你都可以方便的仿问到数据。最终它将会变成`result`出现在`end`的第二个参数位置。
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