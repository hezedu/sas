# task(callback, <span class="dw-heightlight">i</span>)

**i** is the second hidden param of the task, will tell you some of the current location information.

- `index` The index of the current task
- `indexs` function. return a array. all index of root
- `upperIndex([len=1])` function. Returns the index of the `len` layer above the current task

```js
var sas = require('sas');

sas([{h:
      [{e:
        [{l:
          [{l:
            [{o:
              function(cb, i){
                var indexs = i.indexs(), depth = indexs.length
                console.log('index', i.index);
                console.log('indexs', indexs);
                console.log('depth', depth);
                for(let j = 1 ; j < depth; j++){
                  console.log(i.upperIndex(j));
                }
                setTimeout(cb);
              }
            }]
          }]
        }]
      }]
   }]);
```