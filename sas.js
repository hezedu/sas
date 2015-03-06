/*!
 * author:hezedu,
 * Released: jQuery.Released,
 * Date: 2015-02-25,
 * site: 北京,
 *home:http://godmod.cn
 */
function sas(arr, opt) {
  opt = opt || {};
  var debug = opt.debug || sas.debug,
    C_stop = false;
  //DEBUG 1 共六处 
  if (debug) {
    _color(1, '\n开始', 22);
    var C_START = Date.now(),
      C_time = 0;
    function _color(c, str, b) {
      b = b || 39;
      if (typeof window !== 'undefined') {
        console.log(str);
      } else {
        console.log('\u001b[' + c + 'm' + str + '\u001b[' + b + 'm');
      }
    }
  }
  var C_count = [arr.length, 0];
  _dis(C_count[1], arr, C_count);

  function _dis(i, t, count, parents) {
    if (C_stop) {
      return;
    }

//************ ext扩展**********************************
    var ext = {
        index: i,
        path: [i]
      },

      j = 0,
      ps, isSP = false;
    if (parents) {
      ps = parents;
      ext.parent = parents[1];
      ext.pIndex = parents[0];

      while (ps) {
        j++;
        if (!isSP && typeof ps[0] === 'number') {
          ext.Sparent = ps[1];
          isSP = true;
        }
        ext.path.splice(0, 0, ps[0]);
        ps = ps[3];
      }
      /*      ext.parents = function(num) {
              if (num >= j) {
                return;
              }
              ps = parents;
              for (var x = 0; x < num;) {
                ps = ps[3];
              }
              return ps;
            }*/
    }
    ext.push=function(a){
        count[0]++;
        if(ext.parent){
        ext.parent[ext.pIndex].push(a);
      }else{
        count[0]++;
        arr.push(a);
      }
      }
    ext.reload=function(a){
        //count[1]--;
        t[i]=a;
      }

//************ ext扩展结束**********************************
    var ty = Object.prototype.toString.call(t[i]).slice(8, -1);
    //DEBUG 2
    if (debug) {
      var _start = Date.now();
      var path = ext.path.join('/');
      var a_or_sa_c = 90,
        a_or_sa_str = 'AS';
      if (typeof i === 'number') {
        a_or_sa_c = 37;
        a_or_sa_str = 'S ';
      }
      if (ty !== 'Function') {
        _color(a_or_sa_c, a_or_sa_str + ':[' + count[0] + '/' + count[1] + ']\t' + path);
      }
    }
    switch (ty) {
      case 'Object':
        var keys=Object.keys(t[i]), keys_len=keys.length, _count = [keys_len, 0];
        for (var o =0;o<keys_len; o++) {
          //_count[0] ++;
          _dis(keys[o], t[i], _count, arguments);
        }
        break;
      case 'Array':
        var _count = [t[i].length, 0];
        _dis(_count[1], t[i], _count, arguments);
        break;
      case 'Function':

        var args = arguments;
        t[i](_cb, ext);

        function _next_tick(i, t, count, parents) {
          if (count[0] === count[1]) {
            if (parents) {
              parents[2][1] ++;
              _next_tick.apply(null, parents);
            } else{
             if (debug) { //DEBUG 3
              _color(1, '结束', 22);
              _color(96, '回调统计：' + C_time + 'ms'); //所有回调的时间,有可能因为过快或其它原因统计失误
              var time2 = Date.now() - C_START;
              _color(96, '实计用时：' + time2 + 'ms');
              time2 = C_time - time2;
              _color(36, '节省：' + (time2 >= 0 ? time2 : '--') + 'ms');
            }
            if(opt.allEnd){
              opt.allEnd();
            }
            }
          } else {
            if (typeof i === 'number') {
              _dis(count[1], t, count, parents);
            }
          }
        }

        function _cb(result) {
          if (C_stop) {
            //DEBUG 6
            debug && _color(91, path + '\t' + a_or_sa_str + ':' + result);
            return;
          }
          switch (result) { //魔法字符串
            case '$STOP': //中止整个程序
              debug && _color(91, path + '\t' + a_or_sa_str + ':' + result); //DEBUG 4
              return C_stop = true;
              break;
            case '$END': //结束 this
              count[1] = count[0];
              break;
            case '$RELOAD': //结束 this
            _next_tick.apply(null, args);
              //count[1] = count[0];
              break;
            default:
              count[1] ++;
              if (arguments.length < 2) {
                t[i] = result;
              } else {
                var result_tmp = [];
                for (var r_i = 0, len = arguments.length; r_i < len; r_i++) {
                  result_tmp.push(arguments[r_i]);
                }
                t[i] = result_tmp;
              }
          }
          //DEBUG 5
          if (debug) {
            var time = Date.now() - _start;
            C_time += time;
            _color(a_or_sa_c, a_or_sa_str + ':[' + count[0] + '/' + count[1] + ']\t' + path + '\t' + time + 'ms');
          }
          _next_tick.apply(null, args);
        }
        break;
      default:
        if (opt.iterator) {
          t[i] = opt.iterator(t[i]);
          _dis.apply(null, arguments);
        } else {
          throw new Error('The first parameter not contains the type for the ' + ty + ' element.');
          //count[1] ++;
        }
    }
  }
}
if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = sas;
}