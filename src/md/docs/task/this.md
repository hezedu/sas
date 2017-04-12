The context of <big>**task**</big> is not what you see on the surface. <br>
Usually it is replaced by an empty object, or you can initialize it with `optitons.context`.<br>
All the task' `this` are bind to it. So no matter how deep, you can easily ask the data.<br>

In the end it will become `result`: The `end`'s second param.


```js
var sas = require('sas');

//not what you see on the surface
sas([function(callback){
    console.log(this) // {}
    callback();
}])

//end' result is task's context
sas([function(callback){
    this.hello = world;
    callback();
}], function(err, result){
    console.log(result) // {hello: 'world'}
})

// context init
sas([function(callback){
    console.log(this); // {hello: 'world'}
    callback();
}], {context: {hello: 'world'}})

// no matter how deep
sas([
    function(callback){
        this.hello = 'world'
        callback();
    }, 
    {p:[{p:[
    function(callback){
          console.log(this.hello); // 'world'
          callback();
    }
]}]}]);
```