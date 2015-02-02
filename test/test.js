function t1(cb) {
  setTimeout(function() {
    cb(1, 1);
  }, 100);
}

function t2(cb) {
  setTimeout(function() {
    cb(2, 2);
  }, 300);
}

function t3(cb) {
  setTimeout(function() {
    cb(3, 3);
  }, 300);
}

function t4(cb) {
  setTimeout(function() {
    cb(3, 8888);

  }, 300);
}

var line = [t1,
  t2, {
    t3: t3,
    t3_3: t3,
    t4: {
      t41: t1,
      t42: t2
    },
    t1: t1
  },
  t4
];


v1(line);