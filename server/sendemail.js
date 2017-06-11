const nodemailer = require('nodemailer');

module.exports = (email, data, callback) => {
  const transporter = nodemailer.createTransport({
    service: 'qq',
    auth: {
      user: '779249475@qq.com',
      pass: 'edzdtkgutadrbcjc', //  授权码,通过QQ获取
    },
  });
  const mailOptions = {
    from: '779249475@qq.com', // 发送者
    to: email, // 接受者,可以同时发送多个,以逗号隔开
    subject: '激活', // 标题
    //  text: 'Hello world', // 文本
    html: data,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    callback(err, info);
  });
};

