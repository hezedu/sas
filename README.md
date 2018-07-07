[English](README-en.md)
# Sas 3.0.4
Sas是javascript的一个简单的可递归的异步控制库，它使用**Array**代表串行，使用**Object**代表并行，使用**Function**代表任务。串行和并行可无限嵌套，它将会递归执行，无论多深，都能返回你想要的结果。它很小，源代码在包含很多注释和空格的情况下，仍不到200行。

**安装** ：`npm install sas`<br>

### Demo
```js
var fs = require('fs');
var sas = require('sas');

sas({
  $file1: cb => fs.readFile('somedir/file1.txt', cb),
  $file2: cb => fs.readFile('somedir/file2.txt', cb)
}, function(err, result){
  console.log(err, result);
});
```
还有比这个更简单的写法吗？<br>
如果你想知道**sas**是怎么做到的，请访问：<br>
[sas 2 文档](README-2.1.0.md)

[sas 3 中文文档](https://hezedu.github.io/sas/#/docs/sas/tasks)

[sas 3 English docs](https://hezedu.github.io/sas/en/#/docs/sas/tasks)

### 前端直接src
在本项目根目录下`./dist`有打包好的文件供前端使用，支持`amd`加载。如果没有amd的话，会暴露到全局一个变量：`sas`。

### 浏览器支持
不支持8及更早版本的IE浏览器。
