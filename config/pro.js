var _ = require('lodash');
var base = require('./dev');

const conf = {
  indexDir: './',
  staticPath : 'dist',
  baseUrl: '/sas'
};

module.exports =  _.merge(base, conf);
