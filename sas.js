function sas(arr, opt) {
  opt = opt || {};
  var C_count = [arr.length, 0];

  _dis(C_count[1], arr, C_count);

  function _dis(i, t, count, parents) {

    
    console.log('i==' + i+' count= '+count);

    var ty = Object.prototype.toString.call(t[i]).slice(8, -1);
    switch (ty) {
      case 'Object':

        var _count = [0, 0]
        for (var o in t[i]) {

          _count[0] ++;
          _dis(o, t[i], _count, arguments);
        }
        break;
      case 'Array':
        var _count = [t[i].length, 0];
        _dis(_count[1], t[i], _count, arguments);
        break;
      case 'Function':
        
      //count[1] ++;
        t[i](_cb, {
          index: i,
          parent: parents
        });

        function _next_tick(i, t, count, parents) {

          if (count[0] === count[1]) {

            console.log('i222==' + i+' count= '+count);
            if(parents){
            parents[2][1] ++;
            _next_tick.apply(null, parents);
          }
          } else {
            
            if (typeof i === 'number') {
              _dis(count[1], t, count, parents);
            }
          }
        }
        var args = arguments;

        function _cb(result) {
          t[i] = result;
          count[1] ++;
          _next_tick.apply(null, args);
        }
        break;
      default:
        if (opt.iterator) {
          t[i] = opt.iterator(t[i]);
          _dis.apply(null, arguments);
        } else {
          count[1] ++;
        }
    }

  }
}
module.exports = sas;