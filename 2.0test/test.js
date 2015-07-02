var test = function() {
  this.a = false;
  //this.b = true;
  this.c = Date.now();

}

test.prototype.b = true;
//test.prototype.b ='dd';

function t2() {
  //test.call(this);
  this.d = 'd'
}

function c() {}
c.prototype = test.prototype;
t2.prototype = new c;



var test2 = function() {
  this.a = false;
  this.b = true;
  this.c = Date.now();

}

function t3() {
  test2.call(this);
  this.d = 'd'
}


var time = Date.now();
for (var i = 0; i < 99999999; i++) {
  if (!new t3().b) {
    console.log('err');
  }
  // test(task)
}

console.log(Date.now() - time);