var  conf = {
  bundleName: '[name]_bundle.js',   //打包文件的名字
  chunkName: '[name]_chunk.js',     //由code-spliting生成的文件名字
  indexDir: './dist',    //生成index.html的目录。
  staticPath : '',     //本地static目录。 也可以是静态服务器URL比如: https://xxxcdn.com/rtmap
  baseUrl: '',    //网站基本url. 比如：https://hezedu.github.io/clear 的 /clear
  indexData: { //这里数据将会传给index.ejs。
    //build时传自动添加：BASE_URL,BASE_STATIC两个属性。
  }
};

module.exports = conf;
