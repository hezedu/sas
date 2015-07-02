/*
作者:hezedu
https://github.com/hezedu/sas
*/
//主
function sas(tasks, opt, end) {
  //参数样式: 根据参数个数 判定函数的 api样式
  var ite;
  if (typeof opt !== 'object') {
    switch (arguments.length) {
      case 2:
        opt = {
          end: opt
        }
        break;
      case 3:
        opt = {
          ite: opt,
          end: end
        }
        break;
      default:
        opt = {};
    }
  } else {
    opt.end = opt.end || end;
  }
  opt.stop = false;
  opt.error = null;
  opt.tasksCount = 0;
  opt.tasksCountCb = 0;
  tasks = opt.copy ? sas.copy(tasks) : tasks;
  //参数样式完
  //init
  switch (sas.type.call(tasks)) {
    case sas.typeArr[1]: //Object
      var keys = Object.keys(tasks),
        keys_len = keys.length,
        _count = [keys_len, 0];
      for (var o = 0; o < keys_len; o++) {
        sas._dis(keys[o], tasks, _count, arguments);
      }
      break;

    case sas.typeArr[2]: //Array
      var _count = [tasks.length, 0];
      sas._dis(_count[1], tasks, _count, arguments);
      break;
    default:
      return;
  }
  //init end
}

//sas static
sas.typeArr = ['[object,Function]', '[object,Object]', '[object,Array]'];
sas.type = Object.prototype.toString;
sas.copy = function(t) {
  var c = [];
  sas._copy([t], 0, c);
  return c[0];
}
sas._copy = function(t, i, c) {
  ty = sas.type.call(t[i]);
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



//sas static end


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
    tasks = opt.copy ? sas.copy(tasks) : tasks;
    //<DWDEBUG##############################
    this.debug._color(1, '\n开始', 22);
    //##############################DWDEBUG>
    this.init();
  }
  //min 完

//min 初始化
sas.min.prototype.init = function() {
    var ty = sas.type.call(tasks);
    switch (ty) {
      case sas.typeArr[1]: //Object
        var keys = Object.keys(tasks),
          keys_len = keys.length,
          _count = [keys_len, 0];
        for (var o = 0; o < keys_len; o++) {
          this.dis(keys[o], tasks, _count, arguments);
        }
        break;

      case sas.typeArr[2]: //Array
        var _count = [tasks.length, 0];
        this.dis(_count[1], tasks, _count, arguments);
        break;
      default:
        return;
    }
    /*  var count = [0, 1];
      this.dis(count[0], [tasks], count);*/
  }
  //min 初始化完

//min 递归
sas.min.prototype.dis = function(i, t, count, parents) {
    if (this.STOP) {
      return;
    }
    var ty = sas.type.call(t[i]);

    switch (ty) {

      case sas.typeArr[0]: //function
        this.tasks_count++;
        var cbi = new sas.cbi(i, t, count, parents, this);

        if (t[i].length > 1) {
          t[i](cbi.cb, cbi.index());
        } else {
          t[i](cbi.cb);
        }



        break;
      case sas.typeArr[1]: //Object

        var keys = Object.keys(t[i]),
          keys_len = keys.length,
          _count = [keys_len, 0];
        for (var o = 0; o < keys_len; o++) {
          //_count[0] ++;
          this.dis(keys[o], t[i], _count, arguments);
        }
        break;

      case sas.typeArr[2]: //Array
        var _count = [t[i].length, 0];
        this.dis(_count[1], t[i], _count, arguments);
        break;

      default:
    }
  }
  //min 递归完

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
      this.end(this.error, tasks); //国际惯例
    }
  }
}



sas.min.prototype.cbi = function(i, t, count, p, dis) {
  this.i = i;
  this.t = t;
  this.count = count;
  this.p = p;
  this.dis = dis;

}
sas.cbi.prototype.index = function() {
  var ext = {
      index: this.i,
      path: [this.i]
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
        ext.SpIndex = ps[0];
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
  ext.push = function(a) {
    count[0]++;
    if (ext.parent) {
      ext.parent[ext.pIndex].push(a);
    } else { //没有父级，就是到顶了。
      arr.push(a);
    }
  }
  ext.fspath = function(dir) {
    var fspath_arr = [],
      path_arr = this.path;
    for (var path_i = 0, path_len = path_arr.length; path_i < path_len; path_i++) {
      if (typeof path_arr[path_i] === 'string') {
        fspath_arr.push(path_arr[path_i]);
      }
    }
    return fspath_arr;
  }
}
sas.cbi.prototype.nextTick = function(i, t, count, parents) {
  if (count[0] === count[1]) {
    if (parents) {
      parents[2][1]++;
      this.next_tick.apply(null, parents);
    } else { //完结

      if (this.dis.end) {
        this.dis.end(null, arr); //国际惯例
      }
    }
  } else {
    if (typeof i === 'number') {
      this.dis.dis(count[1], t, count, parents);
    }
  }
}
sas.cbi.prototype.cb = function(mag_str, parem) {
  var dis = this.dis;
  dis.tasks_count_cb++;
  if (dis.stop) {
    return;
  }
  if (typeof mag_str === 'string') {
    switch (mag_str) {
      case '$STOP':
        if (dis.end) {
          dis.end(pream);
        }
        return dis.stop = true;
        break;
      case '$THIS=':
        if (this.p) {
          this.p[1][this.p[0]] = pream;
        }
        this.count[1] = this.count[0];
        break;
      case '$END': //结束 this
        this.count[1] = this.count[0];
        break;
        /*            case '$HOLD': // 新加功能：2015-3-23 保持原来的。
                      count[1] ++;
                      break;*/
      case '$RELOAD': //重载当前任务
        this.t[this.i] = pream || this.t[this.i];
        return dis.dis(this.i, this.t, this.count, this.p);
        break;
      default:
        this.count[1]++;
        if (arguments.length < 2) {
          this.t[this.i] = mag_str;
        } else {
          this.t[this.i] = arguments;
        }
        this.nextTick(this.i, this.t, this.count, this.p);
    }

  }


}

sas.cbi.prototype.index = function() {

}



sas.index = function(task, i, key, parents) {
  this.index = i;
  this.count = opt.count;
  this._init = false;
  this._path = null;
  this._fspath = null;

}
sas.index.prototype.path = function() {
    if (!this._path) {

    }
    return this._path;
  }
  /*sas.index.prototype.init = function(){

  }*/
sas.index.prototype.fspath = function() {
  if (!this._fspath) {
    if (!this._path) {
      this.path();
    }
  }
  return this._fspath;
}

sas.index.prototype.parent = function() {
  return new sas.index(parents);
}


//<DWDEBUG##############################
sas.min.prototype.debug = {
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
  }
  //##############################DWDEBUG>