/*!
  *Version: 3.0.2
  *Author: Du Wei
  *Repository: https://github.com/hezedu/sas
  *Released: MIT
*/

(function(){
//dist-wrap top

  var realType = Object.prototype.toString;
  
  // sas(tasks);
  // sas(tasks, end);
  // sas(tasks, opts);
  // sas(tasks, iterator, end);
  // sas(tasks, opts, end);
  function sas(tasks, opts, end) {
    var iterator;
    if (typeof opts !== 'object') {
      switch (arguments.length) {
        case 2:
          end = opts;
          break;
        case 3:
          iterator = opts;
          break;
        default:
          opts = {};
      }
    } else {
      iterator = opts.iterator;
    }
    new Main(tasks, iterator, end, opts);
  }
  function Main(tasks, iterator, end, opts) {
    this.tasks = tasks;
    this.result = opts.context || {}; //Tasks's context
    this.tasksCount = 0;
    this.tasksCbCount = 0;
    this.error = null;
    this.end = end;
    this.iterator = iterator;
    this.process = opts.process;
    this.processInterval = opts.processInterval || 1000;
    this.init();
  }
  
  Main.prototype.init = function() {
    var _count = [1, 0];
    this.dis(_count[1],[this.tasks], _count);
    this._process();
  }
  
  //Recursion
  Main.prototype.dis = function(i, t, count, parents) {
    if (this.error) {
      return;
    }
    var _count;
    switch (realType.call(t[i])) {
      //Function control
      case '[object Function]':
        this.forFn(i, t, count, parents);
        break;
        
        //Object control
      case '[object Object]':
        var keys = Object.keys(t[i]),
          keys_len = keys.length;
        _count = [keys_len, 0];
        for (var o = 0; o < keys_len; o++) {
          this.dis(keys[o], t[i], _count, arguments);
        }
        break;
  
        //Array control
      case '[object Array]':
        _count = [t[i].length, 0];
        this.dis(_count[1], t[i], _count, arguments);
        break;
  
      default:
        //Other control:
        if (this.iterator) {
          t[i] = this.iterator(t[i]);
          this.forFn(i, t, count, parents);
        } else {
          count[1]++;
          this.nextTick(i, t, count, parents);
        }
    }
  }
  
  //Handle tasks
  Main.prototype.forFn = function(i, t, count, parents) {
    this.tasksCount++;
    var ext = null,
      self = this, ti = t[i];
    if (ti.length > 1) {
      ext = new I(i, t, this.tasks, parents);
    }
    ti.call(this.result, cb, ext);
  
    function cb(pream, opts) {
      self.tasksCbCount++;
      if (self.error || count[0] === count[1]) {
        return;
      }
      if(pream){
        switch (pream) {
          case '$reload':
            t[i] = opts || ti;
            return self.dis(i, t, count, parents);
          case '$up':
            count[1] = count[0];
            break;
          default: //error:
            self.error = pream;
            self._end();
            return;
        }
      }else{
        count[1]++;
      }
  
      if(ti.name[0] === '$'){
        self.result[ti.name.substr(1)] = opts;
      }
      self.nextTick(i, t, count, parents);
    }
  }
  
  Main.prototype.nextTick = function(i, t, count, parents) {
    if (count[0] === count[1]) {
      if (parents) {
        parents[2][1]++;
        this.nextTick.apply(this, parents);
      } else {
        this._end();
      }
    } else {
      if (typeof i === 'number') {
        this.dis(count[1], t, count, parents);
      }
    }
  }
  
  Main.prototype._process = function() {
    if (this.process) {
      var self = this;
      self._t = setInterval(function() {
        self.process(self.tasksCount, self.tasksCbCount);
      }, self.processInterval);
    }
  }
  
  //Program end
  Main.prototype._end = function(){
    if (this.process) {
      clearInterval(this._t);
      this.process(this.tasksCount, this.tasksCbCount);
    }
    if (this.end) {
      this.end(this.error, this.result); //International practice: first error.
    }
  }
  
  //*********************************** I ***********************************
  
  function I(i, t, root) {
    this.index = i;
    this._root = root;
    this._parents = arguments;
  }
  
  I.prototype.indexs = function(){
    var ps = this._parents, indexs = [];
    while (ps[3]) {
      indexs.splice(0, 0, ps[0]);
      ps = ps[3];
    }
    return indexs;
  }
  
  I.prototype.upperIndex = function(i) {
    i = i || 1;
    var ps = this._parents;
    while(i > 0 && ps[1] !== this._root){
      ps = ps[3];
      i--;
    }
    if(i === 0) {
      return ps[0]
    }
  }
  
  //module.exports = sas;

//dist-wrap bottom
  if(typeof define === 'function' && define.amd) {
    define(function() {
      return sas;
    });
  }else{
    this.sas = sas;
  }
})();