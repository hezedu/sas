# sas(tasks, <span class="dw-heightlight">end</span>)
**end**is a function, It will be executed at the end of the program. Bring a result or get an error.<br>
## end(error, result)
params follow ___error-first___ style.
### error
As long as the task callback passes an error, the program will abort and the error will appear in the first argument of end.
```js
var sas = require('sas');

// For convenience, use the following method to generate task:
function taskGenerator(k){
  return function(callback){
    setTimeout(function(){
      if(k === 'error'){
        return callback(new Error('Error'));
      }
      console.log(k);
      callback();
    }, Math.random() * 1000)
  }
}

sas([taskGenerator('one'), 
  taskGenerator('error'),
  taskGenerator('two')], //will not execute
  function(err){
    console.error(err.message); //Error
});
```
### result
Result Will be explained later in later chapter.