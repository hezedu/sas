
const sas = require('sas');


function asyncTask(name, cb) {
  const interval = Math.ceil(Math.random() * 200);
  setTimeout(() => {
    const result = name + ' ' + interval +  ' ok';
    console.log(result);
    cb(null, result);
  }, interval);
}


sas([


function $One(cb) {
  asyncTask('One', cb)
},

function $One(cb) {
  asyncTask('One', (err, result) => {
    cb(null, this.One + ' ' + result);
  })
},

{
  $twoA: cb => asyncTask('TwoA', cb),
  $twoB: cb => asyncTask('TwoB', cb),
},

function $Three(cb) {
  asyncTask('Three', cb);
}

],

// option
{
  context: {
    haha: 'ahaha'
  }
},

// end
(err, result) => {
  if(err) {
    console.error('出错了', err);
  } else {
    console.log('result', result);
  }
}

);
