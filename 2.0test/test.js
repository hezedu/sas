var test = function() {
  var c = false;

  function t2(i) {
    if (c) {
      return;
    }
    //console.log(i);
    if (i === 9999) {
      c = true;

    }
    t2(++i);
  }
  t2(0);
}


var test2 = function() {
  this.c = false;
  this.t2(0);

}
test2.prototype.t2 = function(i) {
  if (this.c) {
    return;
  }
  //console.log(i);
  if (i === 9999) {
    this.c = true;
  }
  this.t2(++i);
}
//test();
//new test2()

var time = Date.now();
for (var i = 0; i < 9999; i++) {
  new test2();
}

console.log(Date.now() - time);