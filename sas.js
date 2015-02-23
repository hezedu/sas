function sas(arr, opt) {
  opt = opt || {};
  var debug = opt.debug || sas.debug;
  //DEBUG 1 共四处 
  if (debug) {
    var start = Date.now(),
      C_time = 0;

    function _color(c, str, b) {
      b = b || 39;
      if (typeof window !== 'undefined') {
        console.log(str);
      } else {
        console.log('\u001b[' + c + 'm' + str + '\u001b[' + b + 'm');
      }
    }
    _color(1, '开始', 22);
  }
  var C_count = [arr.length, 0];
  _dis(C_count[1], arr, C_count);

  function _dis(i, t, count, parents) {
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
        var ext = {
            index: i,
            path: [i]
          },
          j = 0,
          ps;
        if (parents) {
          ps = parents;
          ext.parent = parents[1];
          while (ps) {
            j++;
            ext.path.splice(0, 0, ps[0]);
            ps = ps[3];
          }
          ext.parents = function(num) {
            if (num >= j) {
              return;
            }
            ps = parents;
            for (var x = 0; x < num;) {
              ps = ps[3];
            }
            return ps;
          }
        }
        //DEBUG 2
        if (debug) {
          var _start = Date.now(),
            path = ext.path.join('/');
          var sa = '[' + count[0] + '/' + count[1] + ']';
        }
        t[i](_cb, ext);

        function _next_tick(i, t, count, parents) {
          if (count[0] === count[1]) {
            if (parents) {
              parents[2][1] ++;
              _next_tick.apply(null, parents);
            } else if (debug) { //DEBUG 3
              _color(1, '结束', 22);
              _color(96, '统计：' + C_time + 'ms');
              var time2 = Date.now() - start;
              _color(96, '实计用时：' + time2 + 'ms');
              _color(36, '节省：' + (C_time - time2) + 'ms');
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
          //DEBUG 4
          if (debug) {
            var a_or_sa_c = 90,
              a_or_sa_str = 'AS',
              time = Date.now() - _start;
            C_time += time;
            if (typeof i === 'number') {
              a_or_sa_c = 37;
              a_or_sa_str = 'S ';
            }
            _color(a_or_sa_c, path + '\t' + a_or_sa_str + ':' + count[0] + '/' + count[1] + ' ' + time + 'ms');
          }
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