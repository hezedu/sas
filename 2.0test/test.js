var sasnew = require('./sas2.1.js');

var sas = require('../sas.js');


var plan = [
  null, {
    '/1': [null, {
      '/1-1': 'hello!1-1',
      '/1-2': 'hello!1-2',
      '/1-3': 'hello!1-3'
    }],
    '/2': [null, {
      '/2-1': 'hello!2-1',
      '/2-2': 'hello!2-2',
      '/2-3': 'hello!2-3'
    }],
    '/3': [null, {
      '/3-1': 'hello!3-1',
      '/3-2': 'hello!3-2',
      '/3-3': 'hello!3-3'
    }]
  }
];
/*var test = [];
for (var i = 0; i < 9999; i++) {
  test.push(plan);
}*/

var ite = function(a) {
  return function(cb) {
    cb(a);
  }
}

function task(cb){
  cb(1);
}

var t2 = {
  ff:'aa',
  a:task,
  b:{
    c:task,
    d:{
      e:task,
      f:[
      task,task,task
      ]
    }
  },
  c:{
    c:task,
    d:{
      e:task,
      f:[
      task,task,task,{
    c:task,
    d:{
      e:task,
      f:[
      task,task,task,{
  a:task,
  b:{
    c:task,
    d:{
      e:task,
      f:[
      task,task,task
      ]
    }
  },
  c:{
    c:task,
    d:{
      e:task,
      f:[
      task,task,task,{
    c:task,
    d:{
      e:task,
      f:[
      task,task,task
      ]
    }
  }
      ]
    }
  },
  d:{
    c:task,
    d:{
      e:task,
      f:[
      task,task,task,{
  a:task,
  b:{
    c:task,
    d:{
      e:task,
      f:[
      task,task,task
      ]
    }
  },
  c:{
    c:task,
    d:{
      e:task,
      f:[
      task,task,task,{
    c:task,
    d:{
      e:task,
      f:[
      task,task,task
      ]
    }
  }
      ]
    }
  },
  d:{
    c:task,
    d:{
      e:task,
      f:[
      task,task,task,{
  a:task,
  b:{
    c:task,
    d:{
      e:task,
      f:[
      task,task,task
      ]
    }
  },
  c:{
    c:task,
    d:{
      e:task,
      f:[
      task,task,task,{
    c:task,
    d:{
      e:task,
      f:[
      task,task,task
      ]
    }
  }
      ]
    }
  },
  d:{
    c:task,
    d:{
      e:task,
      f:[
      task,task,task
      ]
    }
  }
}
      ]
    }
  }
}
      ]
    }
  }
}
      ]
    }
  }
      ]
    }
  },
  d:{
    c:task,
    d:{
      e:task,
      f:[
      task,task,task
      ]
    }
  }
}

var tarr = [t2];
for(var i =0;i<99;i++){
tarr.push(sasnew.copy(t2));
}
var task = sasnew.copy(tarr);
ite = function(a){
  return function(cb){
    cb('222')
  }
}

for(var i = 0;i<2;i++){


sasnew(task,function(err,result){
    console.log(result);
})

}


//console.log(tarr);

/*var time = Date.now();
for (var i = 0; i < 1; i++) {
  //test(i);

sasnew(sasnew.copy(tarr),function(err,result){

    console.log(result);

})


}
console.log(Date.now() - time);*/