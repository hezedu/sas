var fs = require('fs');
var source =  fs.readFileSync('./dev.js', 'utf-8');
//var version = source.match(/\*Version: /);
var version = /\*Version\: (\S*)\s/.exec(source)[1];

console.log(version)
var packAgeSource = fs.readFileSync('./package.json', 'utf-8');
packAgeSource.replace(/"version"\: "([^"]*)/, function(m, v){
  return m.replace(v, version);
})