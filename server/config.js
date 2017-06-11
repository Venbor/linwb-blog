module.exports = {
  uploadDir: 'updata/ts',  // 文件上传地址
  url: 'http://www.venbor.cn',
  emallpath: 'http://www.venbor.cn/email/welcome/',
  productionSourceMap: true,
  productionGzip: false,
  productionGzipExtensions: ['js', 'css'],
  bundleAnalyzerReport: process.env.npm_config_report,
};
