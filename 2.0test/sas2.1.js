/*
作者:hezedu
https://github.com/hezedu/sas
*/
//主

//*******************************************************************************************************************
function sas(tasks, opt, end) {
  //参数样式: 根据参数个数 判定函数的 api样式
  var ite;
  if (typeof opt !== 'object') {
    switch (arguments.length) {
      case 2:
        end = opt;
        break;
      case 3:
        ite = opt;
        break;
      default:
        opt = {};
    }
  } else {
    ite = opt.iterator;
    end = end || opt.allEnd;
  }
  //参数样式完
  new sas.min(tasks, ite, end, opt);
}
//主end
//*******************************************************************************************************************


//主静态方法
sas.typeArr = ['[object Function]', '[object Object]', '[object Array]'];
sas.typeFn = Object.prototype.toString;

sas.copy = function(t) {
  var c;
  var ty = sas.typeFn.call(t);
  switch (ty) {
    case sas.typeArr[1]: //obj
      c = {};
      for (var i in t) {
        sas._copy(t, i, c);
      }
      break;
    case sas.typeArr[2]: //arr
      c = [], len = t.length;
      for (var i = 0; i < len; i++) {
        sas._copy(t, i, c);
      }
      break;
    default:
      c = t;
  }
  return c;
}
sas._copy = function(t, i, c) {
    var ty = sas.typeFn.call(t[i]);
    switch (ty) {
      case sas.typeArr[1]: //obj
        c[i] = {};
        for (var j in t[i]) {
          sas._copy(t[i], j, c[i]);
        }
        break;
      case sas.typeArr[2]: //arr
        c[i] = [], len = t[i].length;
        for (var j = 0; j < len; j++) {
          sas._copy(t[i], j, c[i]);
        }
        break;
      default:
        c[i] = t[i];
    }
  }
  //主静态方法完
  //*******************************************************************************************************************


//min
sas.min = function(tasks, ite, end, opt) {
  this.tasks_count = 0;
  this.tasks_count_cb = 0;
  this.STOP = false;
  this.error = null;
  this.end = end;
  this.ite = ite;
  this.process = opt.process;
  this.process_interval = opt.process_interval || 1000;
  this.plan = opt.copy ? sas.copy(tasks) : tasks;
  //<DWDEBUG##############################
  //this.debug._color(1, '\n开始', 22);
  //##############################DWDEBUG>
  this.init();

}

//min end

//min 初始化
sas.min.prototype.init = function() {
    switch (sas.typeFn.call(this.plan)) {

      

      case sas.typeArr[1]: //Object

        var keys = Object.keys(this.plan),
          keys_len = keys.length,
          _count = [keys_len, 0];
        for (var o = 0; o < keys_len; o++) {
          this.dis(keys[o], this.plan, _count);
        }
        break;
      case sas.typeArr[2]: //Array

        var _count = [this.plan.length, 0];
        this.dis(_count[1], this.plan, _count);
        break;
      default:
        return;
    }
  }
  //min 初始化完
  //*******************************************************************************************************************



//递归
sas.min.prototype.dis = function(i, t, count, parents) {

    if (this.STOP) {
      return;
    }

    switch (sas.typeFn.call(t[i])) {

      //Function Ctrl
      case sas.typeArr[0]:
        //=========================================
        this.tasks_count++;

        if (t[i].length > 1) {
          t[i](this.cb(i, t, count, parents), new sas.index(i, t, count, parents, this));
        } else {
          t[i](this.cb(i, t, count, parents));
        }

        //=========================================
        break;



        //Object Ctrl
      case sas.typeArr[1]:
        var keys = Object.keys(t[i]),
          keys_len = keys.length,
          _count = [keys_len, 0];
        for (var o = 0; o < keys_len; o++) {
          //_count[0] ++;
          this.dis(keys[o], t[i], _count, arguments);
        }
        break;

        //Array Ctrl
      case sas.typeArr[2]:
        var _count = [t[i].length, 0];
        this.dis(_count[1], t[i], _count, arguments);
        break;


      default:
        //other Ctrl:
        this.tasks_count++;
        if (this.ite) {
          t[i] = this.ite(t[i]);
          

          if (t[i].length > 1) {
            t[i](this.cb(i, t, count, parents), new sas.index(i, t, count, parents, this));
          } else {
            t[i](this.cb(i, t, count, parents));
          }

        }else{
          count[1]++;
          this.next_tick(i, t, count, parents);
        }


    }
  }
  //递归完
  //*******************************************************************************************************************

sas.min.prototype.cb = function(i, t, count, parents) {
  var self = this;
  return function(result, pream) {
    
      //if (typeof result === 'string') {
    switch (result) {
      //==================魔法字==================
      case '$STOP': //中止整个程序
        if (self.end) {
          self.end(pream); //国际惯例，第一个参数err.
        }
        return self.STOP = true;
        break;
      case '$THIS=': //替换掉 this
        if (parents) {
          parents[1][parents[0]] = pream;
        }
        count[1] = count[0];
        break;
      case '$END': //结束 this
        count[1] = count[0];
        break;
      case '$HOLD': // 新加功能：2015-3-23 保持原来的。
        count[1]++;
        break;
      case '$RELOAD': //重载当前任务
        t[i] = pream || t[i];
        self.dis(i, t, count, parents);
        break;
        //==================魔法字结束==================
      default:
        count[1]++;
        if (arguments.length < 2) {
          t[i] = result;
        } else { //如果大于2的话，把arguments变成正常数组，保存
          var result_tmp = [];
          for (var r_i = 0, len = arguments.length; r_i < len; r_i++) {
            result_tmp.push(arguments[r_i]);
          }
          t[i] = result_tmp;
        }
        self.next_tick(i, t, count, parents);
    }
    //}
  }
}


sas.min.prototype.next_tick = function(i, t, count, parents) {

  if (count[0] === count[1]) {
    if (parents) {
      parents[2][1]++;
      this.next_tick.apply(this, parents);
    } else { //完结

      if (this.end) {
        this.end(null, this.plan); //国际惯例
      }
    }
  } else {
    if (typeof i === 'number') {
      this.dis(count[1], t, count, parents);
    }
  }
}



//进度条
sas.min.prototype._process = function() { //over
    if (this.process) {
      this._t = setInterval(function() {
        this.process(this.tasks_count, this.tasks_count_cb);
      }, this.process_interval);
    }
  }
  //进度条完
sas.min.prototype._end = function() { //over
    if (this.process) {
      clearInterval(this._t);
      this.process(this.tasks_count, this.tasks_count_cb);
      if (this.end) {
        this.end(this.error, this.plan); //国际惯例
      }
    }
  }






  //*******************************************************************************************************************


/*sas.cbi = function(i, t, count, parents, dis) {
  this.index = i;
  this.count = count;
  this._t = t;
  this._parents = parents;
  this._dis = dis;
}

sas.cbi.prototype.cb = function(result, pream) {
  //if (typeof result === 'string') {
  switch (result) {
    //==================魔法字==================
    case '$STOP': //中止整个程序
      if (this._dis.end) {
        this._dis.end(pream); //国际惯例，第一个参数err.
      }
      return this._dis.STOP = true;
      break;
    case '$THIS=': //替换掉 this
      if (this._parents) {
        this._parents[1][this._parents[0]] = pream;
      }
      this.count[1] = this.count[0];
      break;
    case '$END': //结束 this
      this.count[1] = this.count[0];
      break;
    case '$HOLD': // 新加功能：2015-3-23 保持原来的。
      this.count[1]++;
      break;
    case '$RELOAD': //重载当前任务
      this._t[this.index] = pream || this._t[this.index];
      this._dis.dis(this.index, this._t, this.count, this._parents);
      break;
      //==================魔法字结束==================
    default:
      this.count[1]++;
      if (arguments.length < 2) {
        this._t[this.index] = result;
      } else { //如果大于2的话，把arguments变成正常数组，保存
        var result_tmp = [];
        for (var r_i = 0, len = arguments.length; r_i < len; r_i++) {
          result_tmp.push(arguments[r_i]);
        }
        this._t[this.index] = result_tmp;
      }
      this.next_tick();
  }
  //}
}

sas.cbi.prototype.next_tick = function() {
  if (this.count[0] === this.count[1]) {
    if (this._parents) {
      this._parents[2][1]++;
      this.next_tick.apply(null, this._parents);
    } else { //完结

      if (this._dis.end) {
        this._dis.end(null, this._dis.plan); //国际惯例
      }
    }
  } else {
    if (typeof this.index === 'number') {
      this._dis.dis(this.count[1], this._t, this.count, this._parents);
    }
  }
}*/



 //*******************************************************************************************************************







sas.index = function(i, t, count, parents, dis) {
  this.index = i;
  this.path = [i];
  this.count = count;
  this.dis = dis;

  var j = 0,
    ps, isSP = false;

  if (parents) {
    ps = parents;
    this.parent = parents[1];
    this.pIndex = parents[0];

    while (ps) {
      j++;
      if (!isSP && typeof ps[0] === 'number') {
        this.Sparent = ps[1];
        this.SpIndex = ps[0];
        isSP = true;
      }
      this.path.splice(0, 0, ps[0]);
      ps = ps[3];
    }
    /*      this.parents = function(num) {
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
}



/*sas.index.prototype.path = function() {
  if (!this._init) {
    this.init();
  }
  return this._path;
}*/

sas.index.prototype.fspath = function() {
  var fspath_arr = [],
    path_arr = this.path;
  for (var path_i = 0, path_len = path_arr.length; path_i < path_len; path_i++) {
    if (typeof path_arr[path_i] === 'string') {
      fspath_arr.push(path_arr[path_i]);
    }
  }
  return fspath_arr;
}

sas.index.prototype.push = function(a) {
  this.count[0]++;
  if (this.parent) {
    this.parent[this.pIndex].push(a);
  } else { //没有父级，就是到顶了。
    this.dis.plan.push(a);
  }
}

if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = sas;
}
//<DWDEBUG##############################
/*sas.min.prototype.debug = {
    C_START: Date.now(),
    C_time: 0,
    _color: function(c, str, b) {
      b = b || 39;
      if (typeof window !== 'undefined') {
        console.log(str);
      } else {
        console.log('\u001b[' + c + 'm' + str + '\u001b[' + b + 'm');
      }
    }
  }*/
//##############################DWDEBUG>