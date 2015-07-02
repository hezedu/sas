var sas = {}
sas.typeArr = ['[object,Function]', '[object,Object]', '[object,Array]'];
sas.typeFn = Object.prototype.toString;
sas.copy = function(t) {
  var c = [];
  sas._copy([t], 0, c);
  //c = c[0]
  return c[0];
}

/*sas._copy = function(t, i, c) {
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
}*/
sas.oo = 'object'
sas._copy = function(t, i, c) {
  if (typeof t[i] === sas.oo) {
    if (Array.isArray(t[i])) {
      c[i] = [], len = t[i].length;
      for (var j = 0; j < len; j++) {
        sas._copy(t[i], j, c[i]);
      }
    } else {
      c[i] = {};
      for (var j in t[i]) {
        sas._copy(t[i], j, c[i]);
      }
    }
  } else {
    c[i] = t[i];
  }
}

var test = {
  a: 'a',
  b: [1, 2, 3],
  c: {
    d: [1, 2, 3]
  }
}
console.log(sas.copy(test));

var time = Date.now();
for (var i = 0; i < 9999999; i++) {
sas.copy(test)
}

console.log(Date.now() - time);