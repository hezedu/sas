var dw_com = require('dw_com');

function v1(plan) {

  var next_tick = 0;

  var obj_preant;

  var fn_len = 0;
  var count = 0;
  var isObj = false;

  function loop(arr, preant, ikeys) {


    //var next_tick = 0;
    var result_arr = [];

    var ty = dw_com.is(arr);
    switch (ty) {
      case 'Array':

        obj_preant = arr;

        _forarr(next_tick, arr);

        break;
      case 'Object':
        isObj = true;

        var keys = Object.keys(preant),
          len = keys.length;

        for (var i in arr) {
          loop(arr[i], arr, i);
        }

        break;
      case 'Function':
        if (isObj) {
          fn_len = fn_len + 1;
        }
        arr(cb);
        break;
      default:
        throw new Error('格式不对');
    }


    //callback
    function cb(err, result) {



      if (isObj) {
        count = count + 1;
      }



      if (preant) {

        var ty = dw_com.is(preant);

        if (ty === 'Array') {

          preant[next_tick] = result;
          next_tick = next_tick + 1;
          _forarr(next_tick, preant);


        } else if (ty === 'Object') {

          preant[ikeys] = result;

          if (count === fn_len) {

            fn_len = count = 0;
            isObj = false;

            console.log('next_tick===' + next_tick + ' obj_preant==' + JSON.stringify(obj_preant));

            next_tick = next_tick + 1;

            _forarr(next_tick, obj_preant);

          }
        } else {
          next_tick = next_tick + 1;
        }

      }

      //console.log(' result===' + JSON.stringify(plan));

    }


  };

  loop(plan);

  function _forarr(i, arr) {
    if (i < arr.length) {
      loop(arr[i], arr);
    }
  }
}



function t1(cb) {
  setTimeout(function() {
    cb(1, 1);
  }, 100);
}

function t2(cb) {
  setTimeout(function() {
    cb(2, 2);
  }, 300);
}

function t3(cb) {
  setTimeout(function() {
    cb(3, 3);
  }, 300);
}

function t4(cb) {
  setTimeout(function() {
    cb(3, 8888);

  }, 300);
}

var line = [t1,
  t2, {
    t3: t3,
    t3_3: t3,
    t4: {
      t41: t1,
      t42: t2
    },
    t1: t1
  },
  t4
];


v1(line);