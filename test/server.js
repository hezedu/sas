var express = require('express');
var path = require('path');
var app = express();
console.log(path.join(__dirname, '../dist'));
app.use('/dist', express.static(path.join(__dirname, '../dist')));
app.get('/', express.static(path.join(__dirname)));

app.listen(3000);
console.log('server listen 3000');