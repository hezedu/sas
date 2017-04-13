var fs = require('fs');
var sas = require('./dev.js');
var uglify = require('uglify-js');
var wrap = require('dist-wrap');

var version = require('./package.json').version,
  noteStart = '/*!', 
  note, 
  devSource,
  proSource,
  distProSource

function readDev(cb) {
  fs.readFile('./dev.js', 'utf-8', function(err, source) {
    if (err) return cb(err);
    source = source.replace(noteStart, noteStart + '\n  *Version: ' + version);
    devSource = source;
    note = /^\/\*([\s\S]*)\*\/\n/.exec(source)[0];//提取注释，sas-min.js要用到。
    source = source.replace(/((\n)+)(\s*)\/\/\<DWDEBUG([\s\S ]*?)DWDEBUG\>((\n)+)/g, '\n');
    proSource = source;
    cb(null);
  })
}

var writePro = cb =>  fs.writeFile('./index.js', proSource, cb);

var distDev = cb =>  {
  fs.writeFile('./dist/sas-dev.js', wrap(devSource), cb);
}
var distPro = cb =>  {
  distProSource = wrap(proSource);
  fs.writeFile('./dist/sas.js', distProSource, cb);
}

function proMin(cb) { //生成压缩min.js，前端使用
  var data = uglify.minify(distProSource, {
    fromString: true
  });
  fs.writeFile('./dist/sas-min.js', note + data.code, cb);
}

// sas([readDev, {
//   writePro,
//   distDev,
//   distPro: [distPro, proMin]
// }]);

var $readMe = (cb) => fs.readFile('./README.md', 'utf-8', cb);

var writeMe = function(cb) { //更新 readMe首部 版本号
  var data = this.readMe;
  var first_n = data.indexOf('\n');
  var top = data.substr(0, first_n);
  top = top.split('# Sas ');
  if(top[1] === version){
    cb();
  }else{
    top[1] = version;
    top = top.join('Sas ');
    data = top + data.substr(first_n);
    fs.writeFile('./README.md', data, cb);
  }
}

sas({
  code: [readDev, {
    writePro,
    distDev,
    distPro: [distPro, proMin]
  }],
  readMeUpdate: [$readMe, writeMe]
});