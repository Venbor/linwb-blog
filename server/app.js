const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const favicon = require('serve-favicon');
const routes = require('./routes');

app.use(favicon(path.join(__dirname, 'favicon.ico')));

//  设置静态文件目录
app.use('/updata', express.static(path.join(__dirname, './updata')));
app.use(express.static(path.join(__dirname, '../dist')));

//  服务器API路由
app.use(routes);

// 博客首页
app.get('*', (req, res) => {
  const html = fs.readFileSync(path.join(__dirname, './index.html'), 'utf-8');
  res.send(html);
});

//  监听端口
app.listen(8000);
