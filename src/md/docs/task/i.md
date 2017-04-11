# task(callback, <span class="dw-heightlight">i</span>)

**i**是task的第二个隐藏参数，会告诉你当前的一些位置信息。

- `index` 当前task的index
- `indexs` 数组。当前task到最顶层的所经过的所有路径。
- `upperIndex([len=1])` function。返回当前task上面len层的index

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