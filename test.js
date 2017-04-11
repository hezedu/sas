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