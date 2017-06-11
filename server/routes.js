const express = require('express');
const formidable = require('formidable');
const jwt = require('jsonwebtoken');

const router = express.Router();
const api = require('./api');
const config = require('./config');
// 表单处理
function formparse(req, res, callback) {
  const form = new formidable.IncomingForm({
    encoding: 'utf-8',
    uploadDir: config.uploadDir,  // 文件上传地址
    keepExtensions: true,  // 保留后缀
  });
  form.on('error', () => {
    res.json({ result: false, msg: '文件上传失败！' });
  });
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.json({ result: false, msg: '请求解析失败' });
    } else {
      callback(fields, files);
    }
  });
    // callback(err, fields, files)有三个参数fields对象包含表单所以的文本域单选框,所以文件域放fils对象里
    // 文件上传需要在提交form添加enctype="multipart/form-data"
}
// 根据act参数调用接口api
router.all('/api/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  formparse(req, res, (fields, files) => {
    const action = fields.act;
    const token = fields.token;
    jwt.verify(token, 'signinsecret', (err, decoded) => {
      if (err) {
        if (action === 'register') {
          api[action](req, res, fields, files);
          return;
        }
        if (action === 'signin') {
          api[action](req, res, fields, files);
          return;
        }
        if (action === 'updataimg') {
          api[action](req, res, fields, files);
          return;
        }
        res.status(401).json({
          result: false,
          msg: '未授权',
        });
      } else {
        fields.uid = decoded.uid;// 将解密的用户id(uid)添加到请求信息
        try {
          api[action](req, res, fields, files);
        } catch (error) {
          console.error(error);
          res.json({
            result: false,
            msg: '无效的act',
          });
        }
      }
    });
  });
});
// 激活用户路由
router.get('/email/welcome/:act', (req, res) => {
  const url = req.params.act;
  api.activate(req, res, url);
});


module.exports = router;
