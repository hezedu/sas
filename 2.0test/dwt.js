var dwt = {
  copy: function(t) {
    var c;
    if (typeof t === 'object') {
      if (Array.isArray(t)) {
        c =[];
        var len = t.length;
        for (var i = 0; i < len; i++) {
          dwt._copy(t, i, c);
        }
      } else {
        c = {}
        for (var i in t) {
          dwt._copy(t, i, c);
        }
      }
    } else {
      c = t;
    }
    return c;
  }
  _copy: function(t, i, c) {
    if (typeof t === 'object') {
      if (Array.isArray(t[i])) {
        c[i] = [];
        var len = t.length;
        for (var o = 0; o < len; o++) {
          dwt._copy(t[i], i, c[i]);
        }
      } else {
        for (var i in t) {
          dwt._copy(t, i, c);
        }
      }
    } else {
      c = t;
    }
  }
}