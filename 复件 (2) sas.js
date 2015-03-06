/*!
 * author:hezedu,
 * Released: jQuery.Released,
 * Date: 2015-02-25,
 * site: 北京,
 *home:http://godmod.cn
 */

 function createI(obj) {
  obj = obj || {};

  this.This = obj.This;
  this.index = obj.index;
  this.parent = obj.parent;
  this.count = obj.count;
  this.deep = obj.deep;
  this.path = obj.path;
  this.type = obj.type;
}

var cp = createI.prototype;

cp.push = function(a) {
  var p = this.parent;
  p.This[p.index].push(a);
  this.count[0] ++;
}

cp.Sparent = function(){
  var p =this.parent;
  if(p){
  return (p.type=== 'Array') ? p.This : p.parent.This;
  }
}

cp.reload = function(a) {
  this.This[this.index] = a;
  this.count[1] --;
}


function sas(a,opt){

var C_count = [a.length, 0],
C_stop=false;
  _dis(new createI({
      This: a,
      index: C_count[1],
      count: C_count,
      parent: null,
      deep: 0,
      path: [],
      type: 'Array'
    }));

function _dis(I) { //主递归程序  I是索引的意思
  if (C_stop) {
    return; //中止
  }
  console.log(I.Sparent())
  var curr = I.This[I.index],
  ty = Object.prototype.toString.call(curr).slice(8, -1); //type

  function _createI(_index, _count) {
    return new createI({
      This: curr,
      index: _index,
      count: _count,
      parent: I,
      deep: I.deep + 1,
      path: I.path.push(_index),
      type: ty
    })
  }

  switch (ty) {
    case 'Object':
      var keys = Object.keys(curr),
        keys_len = keys.length,
        _count = [keys_len, 0];
      for (var i = 0; i < keys_len; i++) {
        _dis(_createI(keys[i], _count));
      }
      break;

    case 'Array':
      var _count = [curr.length, 0];
      _dis(_createI(_count[1], _count));
      break;

    case 'Function':

      I.This[I.index](_cb, I);

      function _cb(result) {
        if (typeof result === 'string' && result[0] === '$') {
          switch (result) {
            case '$EXIT':
              return C_stop = true;
            case '$END':
              I.count[1] = I.count[0];
              break;
            default:
              break;
          }
        } else {
          I.count[1] ++;
        }

        I.This[I.index] = (arguments.length < 2) ? result : arguments; //保存

        if (I.count[1] === I.count[0]) {
          if (I.parent) {
            I.parent.count[1] ++;
            _dis(I.parent);
          } else {
            //$程序结束
          }
        } else if (I.type === 'Array') {
          _dis(I);//sync 下一步。
        }
      }
      break;
    default:
      break;

  }
}



}

if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = sas;
}