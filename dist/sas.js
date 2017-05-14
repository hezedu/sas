/*!
  *Version: 3.0.4
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
      }
      opts = {};
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
    this.dis(this.tasks, _count[1], _count);
    this._process();
  }
  
  //Recursion
  Main.prototype.dis = function(v, i, count, parents) {
    if (this.error) {
      return;
    }
    var _count;
    switch (realType.call(v)) {
      
      //Function control
      case '[object Function]':
        this.forFn(v, i, count, parents);
        break;
        
        //Object control
      case '[object Object]':
        var keys = Object.keys(v), len = keys.length;
        _count = [len, 0];
        for (var o = 0; o < len; o++) {
          var k = keys[o];
          this.dis(v[k], k, _count, arguments);
        }
        break;
  
        //Array control
      case '[object Array]':
        _count = [v.length, 0];
        this.dis(v[0], _count[1], _count, arguments);
        break;
  
      default:
        //Other control:
        if (this.iterator) {
          this.forFn(this.iterator(v), i, count, parents);
        } else {
          count[1]++;
          this.nextTick(v, i, count, parents);
        }
    }
  }
  
  //Handle tasks
  Main.prototype.forFn = function(v, i, count, parents) {
    this.tasksCount++;
    var ext = null,
      self = this;
    if (v.length > 1) {
      ext = new I(v, i, count, parents, this.tasks);
    }
    v.call(this.result, cb, ext);
  
    function cb(pream, opts) {
      self.tasksCbCount++;
      if (self.error || count[0] === count[1]) {
        return;
      }
      if(pream){
        switch (pream) {
          case '$reload':
            opts  = opts || v;
            return self.dis(opts, i, count, parents);
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
  
      if(v.name[0] === '$'){
        self.result[v.name.substr(1)] = opts;
      }
      self.nextTick(v, i, count, parents);
    }
  }
  
  Main.prototype.nextTick = function(v, i, count, parents) {
  
    if (count[0] === count[1]) {
      if (parents) {
        parents[2][1]++;
        this.nextTick.apply(this, parents);
      } else {
        this._end();
      }
    } else {
      if (typeof i === 'number') {
        this.dis(parents[0][count[1]], count[1], count, parents);
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
  
  function I(v, i, count, parents, root) {
    this.index = i;
    this._count = count;
    this._root = root;
    this._parents = arguments;
  }
  
  I.prototype.indexs = function(){
    var ps = this._parents, indexs = [];
    while (ps[3]) {
      indexs.splice(0, 0, ps[1]);
      ps = ps[3];
    }
    return indexs;
  }
  
  I.prototype.upperIndex = function(i) {
    i = i || 1;
    var ps = this._parents;
    while(i > 0 && ps[0] !== this._root){
      ps = ps[3];
      i--;
    }
    if(i === 0) {
      return ps[1]
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