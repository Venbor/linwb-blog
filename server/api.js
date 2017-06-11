const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const sendemail = require('./sendemail');
const { query } = require('./mysqldb');
const config = require('./config');

// token参数详解
// 生成token
// var token = jwt.sign({data: 'foobar'}, 'secret', { expiresIn: 60 * 60 }); //一个小时的有效期
// 解码token
// jwt.verify(token, 'shhhhh', function(err, decoded) {
//   console.log(decoded.foo) // bar
// });
// 时间处理函数参数为时间对象=new Date(时间戳)
module.exports = {
// 注册
  register: function (req, res, fields) {
          // 验证表单
    if (!fields.username || fields.username.length > 8) {
      res.json({ result: false, msg: '用户名不能为空且长度小于8' });
      return;
    }
    if (!fields.email || fields.email.length > 20) {
      res.json({ result: false, msg: '邮箱不能为空且长度小于20' });
      return;
    }
    if (!fields.password || fields.password.length > 20) {
      res.json({ result: false, msg: '密码不能为空且长度小于20!' });
      return;
    }
    // 查找邮箱是否已经被注册
    function fn1() {
      return new Promise((resolve, reject) => {
        query(`SELECT * from users where email = "${fields.email}"`, '', (err, result) => {
          if (result.length >= 1) {
            res.json({ result: false, msg: '该邮箱已经被注册!', aaa: result.length });
            reject();
          } else {
            resolve();
          }
        });
      });
    }
    // 注册邮箱内发送激活链接
    function fn2() {
      return new Promise((resolve, reject) => {
        const token = jwt.sign({ email: fields.email }, 'emailsecret', { expiresIn: 60 * 60 * 24 * 7 });
        const path = config.emallpath;
        const longpath = path + token;
        sendemail(fields.email, `<h1>欢迎注册，点击链接激活账号<a href="${longpath}"'>${token}</a></h1>`, (err) => {
          if (err) {
            res.json({ result: false, msg: '注册失败，用户邮箱不合法！' });
            reject();
          } else {
            resolve();
          }
        });
      });
    }
   // 注册成功后数据库插入用户信息
    function fn3() {
      return new Promise((resolve, reject) => {
        query('INSERT INTO users SET ?', {
          username: fields.username,
          email: fields.email,
          status: 0,
          password: crypto.createHash('md5').update(fields.password.toString()).digest('hex').substr(6, 20),
        }, (err) => {
          if (err) {
            res.json({ result: false, msg: '注册失败', err: err });
            reject();
          } else {
            const data = {
              result: true,
              msg: '注册成功,系统已发送激活链接到您的邮箱，账号需激活才可以使用',
              email: fields.email,
            };
            res.json(data);
            resolve();
          }
        });
      });
    }
    // 处理
    fn1().then(fn2).then(fn3).catch((err) => { console.error(err); });
  },

// 登录
  signin: function (req, res, fields) {
    // 验证表单
    if (!fields.email || fields.email.length > 20) {
      res.json({ result: false, msg: '邮箱不能为空且长度小于20' });
      return;
    }
    if (!fields.password || fields.password.length > 20) {
      res.json({ result: false, msg: '密码不能为空且长度小于20!' });
      return;
    }
    // 判断用户名是否存在
    function fn1() {
      return new Promise((resolve, reject) => {
        query(`SELECT * FROM users WHERE email = "${fields.email}"`, '', (err, result) => {
          if (result.length == 0) {
            res.json({ result: false, msg: '该用户不存在！' });
            reject();
          } else if (!result[0].status) {
            res.json({ result: false, msg: '该用户尚未激活，请前往注册邮箱点击激活链接！' });
            reject();
          }
          resolve(result);
        });
      });
    }
    // 登录返回授权token
    function fn2(param) {
      return new Promise((resolve, reject) => {
        const pwd = param[0].password; // 获取上面传过来的param
        const reqpwd = crypto.createHash('md5').update(fields.password.toString()).digest('hex').substr(6, 20);
        if (reqpwd !== pwd) {
          res.json({ result: false, msg: '密码错误，请重新输入！' });
          reject();
        } else {
          const token = jwt.sign({ email: fields.email, uid: param[0].id }, 'signinsecret', { expiresIn: 60 * 60 * 24 * 7 });
          const data = {
            result: true,
            msg: '登录成功',
            token: token,
            email: fields.email,
            checked: fields.checked,
          };
          res.json(data);
          resolve();
        }
      });
    }
  // 处理
    fn1().then(fn2).catch((err) => { console.error(err); });
  },

// 激活
  activate: function (req, res, url) {
    jwt.verify(url, 'emailsecret', (err, decoded) => {
      if (err) {
        res.send('页面不存在');
      } else {
        query(`UPDATE users SET status=1 WHERE email="${decoded.email}"`, '', (error) => {
          if (error) {
            res.send(error);
          } else {
            res.send(' 账号激活成功，赶紧去登录吧！');
          }
        });
      }
    });
  },

// 获取用户详情
  userdetail: function (req, res, fields) {
    query(`SELECT * FROM users WHERE id =${fields.uid}`, '', (err, result) => {
      if (err) {
        res.json({ result: false, msg: '获取用户信息失败！' });
        return;
      }
      const url = `${config.url}/${result[0].imgurl}`;
      const navArry = JSON.parse(result[0].nav);
      res.json({ result: true,
        msg: 'success',
        data: {
          username: result[0].username,
          email: result[0].email,
          introduce: result[0].introduce,
          nav: result[0].nav,
          signature: result[0].signature,
          nav: navArry,
          address: result[0].address,
          imgurl: url,
        },
      });
    });
  },
// 暂存提交图片地址,返回暂存图片地址
  updataimg: function (req, res, fields, files) {
    res.json({
      result: true,
      path: files.file.path,
    });
  },
// 更新用户详情
  updatauserdetail: function (req, res, fields) {
       // 验证表单
    if (!fields.username || fields.username.length > 8) {
      res.json({ result: false, msg: '用户名不能为空且长度小于8' });
      return;
    }
    if (!fields.signature || fields.signature.length > 30) {
      res.json({ result: false, msg: '个性签名不能为空且长度小于30' });
      return;
    }
    if (!fields.introduce || fields.introduce.length > 22) {
      res.json({ result: false, msg: '职业介绍不能为空且长度小于22!' });
      return;
    }
    if (fields.address.length > 20) {
      res.json({ result: false, msg: '地址必须长度小于18!' });
      return;
    }
      // 修改用户基本信息
    function fn1() {
      return new Promise((resolve, reject) => {
        const data = [fields.username, fields.signature, fields.introduce, fields.address];
        query(`UPDATE users SET username=? ,signature=? ,introduce=?,address=? WHERE id =${fields.uid}`, data, (err) => {
          if (err) {
            res.json({ result: false, msg: '更新用户信息失败！' });
            reject();
          } else {
            resolve();
          }
        });
      });
    }
      // 根据提交的参数把缓存的图片修改到用户图片文件夹
    function fn2() {
      return new Promise((resolve, reject) => {
        if (fields.imgurl) {
          const arr = fields.imgurl.split('.');
          const type = arr[arr.length - 1];
          const newpath = `./updata/users/${fields.uid}${Math.floor(Math.random() * 900)}${Date.parse(new Date())}.${type}`;
          fs.rename(`./${fields.imgurl}`, newpath, (err) => {
            if (err) {
              res.json({ result: false, msg: '更新用户头像失败！' });
              reject();
            } else {
              resolve(newpath);
            }
          });
        } else {
          res.json({ result: true, msg: '用户信息更新成功' });
          reject();

        }
      });
    }
    // 修改用户的头像信息
    function fn3(param) {
      return new Promise((resolve, reject) => {
        query(`UPDATE users SET imgurl="${param}" WHERE id =${fields.uid}`, '', (err) => {
          if (err) {
            res.json({ result: false, msg: '更新用户头像失败！' });
          } else {
            res.json({ result: true, msg: '用户信息更新成功' });
            reject();
          }
        });
      });
    }
      // 处理
    fn1().then(fn2).then(fn3).catch((err) => { console.error(err); });
  },
// 新增栏目
  addnav: function (req, res, fields) {
      // 验证
    if (!fields.title || fields.title.length > 12) {
      res.json({ result: false, msg: '栏目名称不能为空且长度小于12!' });
      return;
    }
    if (!fields.weight || fields.weight.length > 2 || !parseInt(fields.weight)) {
      res.json({ result: false, msg: '权重不能为空且必须长度小于2的整数!' });
      return;
    }
    let param;
    function fn1() {
          // 第一步获取用户栏目信息
      return new Promise((resolve, reject) => {
        query(`SELECT * FROM users WHERE id = ${fields.uid}`, '', (err, result) => {
          if (err) {
            res.json({ result: false, msg: '添加栏目失败！' });
            reject();
          } else {
            param = result[0].nav;
            resolve();
          }
        });
      });
    }
    function fn2() {
         // 第二步新增栏目
      return new Promise((resolve, reject) => {
        const Arry = JSON.parse(param);
        let ishas = false;
        Arry.forEach((value) => {
          if (value.title == fields.title) {
            ishas = true;
          }
        });
        if (ishas) {
          res.json({ result: false, msg: '栏目已经存在，请勿重复添加！' });
          return;
        }
        if (Arry.length > 11) {
          res.json({ result: false, msg: '栏目最多允许添加12条，请勿过多添加！' });
          return;
        }
        const obj = {};
        obj.title = fields.title;
        obj.weight = parseInt(fields.weight);
        obj.num = 0;
        Arry.push(obj);
        const compare = function (val1, val2) {
          if (val1.weight < val2.weight) {
            return 1;
          } else if (val1.weight > val2.weight) {
            return -1;
          }
          return 0;

        };
        Arry.sort(compare);
        const toString = JSON.stringify(Arry);
        query(`UPDATE users SET nav=? WHERE id =${fields.uid}`, toString, (err) => {
          if (err) {
            res.json({ result: false, msg: '添加栏目失败！' });
            reject();
          } else {
            res.json({ result: true, msg: '添加栏目成功！' });
            resolve();
          }
        });
      });
    }
      // 执行
    fn1().then(fn2).catch((err) => { console.error(err); });
  },
// 更新栏目
  updatanav: function (req, res, fields) {
        // 验证
    if (!fields.title || fields.title.length > 12) {
      res.json({ result: false, msg: '栏目名称不能为空且长度小于12!' });
      return;
    }
    if (!fields.weight || fields.weight.length > 2 || !parseInt(fields.weight)) {
      res.json({ result: false, msg: '权重不能为空且必须长度小于2的整数!' });
      return;
    }
    let param;
      // 第一步获取栏目内容
    function fn1() {
      return new Promise((resolve, reject) => {
        query(`SELECT * FROM users WHERE id = ${fields.uid}`, '', (err, result) => {
          if (err) {
            res.json({ result: false, msg: '获取栏目信息失败！' });
            reject();
          } else {
            param = result[0].nav;
            resolve();
          }
        });
      });
    }
      // 第二步对栏目进行修改操作
    function fn2() {
      return new Promise((resolve, reject) => {
        const Arry = JSON.parse(param);
        let ishas = false;
        if (fields.title != fields.oldtitle) {
          Arry.forEach((value) => {
            if (value.title === fields.title) {
              ishas = true;
            }
          });
        }
        if (ishas) {
          res.json({ result: false, msg: '栏目已经存在，请勿重复添加！' });
          return;
        }
        let del = '';
        Arry.forEach((value, index) => {
          if (value.title === fields.oldtitle) {
            del = index;
          }
        });
        Arry.splice(del, 1);
        const obj = {};
        obj.title = fields.title;
        obj.weight = fields.weight;
        obj.num = fields.num;
        Arry.push(obj);
        const compare = function (val1, val2) {
          if (val1.weight < val2.weight) {
            return 1;
          } else if (val1.weight > val2.weight) {
            return -1;
          }
          return 0;
        };
        Arry.sort(compare);
        const toString = JSON.stringify(Arry);
        query(`UPDATE users SET nav=? WHERE id =${fields.uid}`, toString, (err) => {
          if (err) {
            res.json({ result: false, msg: '修改栏目失败！' });
            reject();
          } else {
            resolve();
          }
        });
      });
    }
       // 更新栏目下的所有文章栏目
    function fn3() {
      return new Promise((resolve, reject) => {
        const sqlstring = `uid = ${fields.uid} AND columns ="${fields.oldtitle}"`;
        query(`UPDATE articles SET columns=? WHERE ${sqlstring}`, fields.title, (err) => {
          if (err) {
            res.json({ result: false, msg: '修改栏目失败2！' });
            reject();
          } else {
            res.json({ result: true, msg: '修改栏目成功！' });
            resolve();
          }
        });
      });
    }
          // 执行
    fn1().then(fn2).then(fn3).catch((err) => { console.error(err); });
  },
// 删除栏目
  deletenav: function (req, res, fields) {
    let param;
         // 第一步获取用户的导航栏目信息
    function fn1() {
      return new Promise((resolve, reject) => {
        query(`SELECT * FROM users WHERE id = ${fields.uid}`, '', (err, result) => {
          if (err) {
            res.json({ result: false, msg: '删除栏目失败！' });
            reject();
          } else {
            param = result[0].nav;
            resolve();
          }
        });
      });
    }
        // 第二步对栏目进行删除
    function fn2() {
      return new Promise((resolve, reject) => {
        const Arry = JSON.parse(param);
        let del = '';
        Arry.forEach((value, index) => {
          if (value.title == fields.title) {
            del = index;
          }
        });
        Arry.splice(del, 1);
        const toString = JSON.stringify(Arry);
        query(`UPDATE users SET nav=? WHERE id =${fields.uid}`, toString, (err) => {
          if (err) {
            res.json({ result: false, msg: '删除栏目失败！' });
            reject();
          } else {
            resolve();
          }
        });
      });
    }
       // 第三步删除对应栏目下的全部文章
    function fn3() {
      return new Promise((resolve, reject) => {
        const sqlstring = `uid = ${fields.uid} AND columns ="${fields.title}"`;
        query(`DELETE FROM articles WHERE ${sqlstring}`, '', (err) => {
          if (err) {
            res.json({ result: false, msg: '删除栏目失败！' });
            reject();
          } else {
            res.json({ result: true, msg: '删除栏目成功！' });
            resolve();
          }
        });
      });
    }
      // 执行
    fn1().then(fn2).then(fn3).catch((err) => { console.error(err); });
  },
// 添加文章
  addarticle: function (req, res, fields) {
    if (!fields.title || fields.title.length > 40) {
      res.json({ result: false, msg: '标题不能为空且长度小于40！' });
      return;
    }
    if (!fields.digest || fields.digest.length > 120) {
      res.json({ result: false, msg: '摘要不能为空且长度小于120!' });
      return;
    }
    if (!fields.columns || fields.columns == '选择栏目') {
      res.json({ result: false, msg: '栏目不能为空!' });
      return;
    }
    if (!fields.contents) {
      res.json({ result: false, msg: '内容不能为空！' });
      return;
    }
    const nowtime = new Date();
    let param;
    // 第一步插入文章
    function fn1() {
      return new Promise((resolve, reject) => {
        query('INSERT INTO articles SET ?', {
          uid: fields.uid,
          title: fields.title,
          digest: fields.digest,
          columns: fields.columns,
          contents: fields.contents,
          updatatime: nowtime,
        }, (err) => {
          if (err) {
            res.json({ result: false, msg: '文章发布失败' });
            reject();
          } else {
            resolve();
          }
        });
      });
    }
    // 第二步获取栏目信息
    function fn2() {
      return new Promise((resolve, reject) => {
        query(`SELECT * FROM users WHERE id = ${fields.uid}`, '', (err, result) => {
          if (err) {
            res.json({ result: false, msg: '文章发布失败！' });
            reject();
          } else {
            param = result[0].nav;
            resolve();
          }
        });
      });
    }
    // 第三步对对应栏目下的文章数量+1
    function fn3() {
      return new Promise((resolve, reject) => {
        const Arry = JSON.parse(param);
        let changeindex;
        Arry.forEach((value, index) => {
          if (value.title == fields.columns) {
            changeindex = index;
          }
        });
        Arry[changeindex].num += 1;
        const toString = JSON.stringify(Arry);
        query(`UPDATE users SET nav=? WHERE id =${fields.uid}`, toString, (err) => {
          if (err) {
            res.json({ result: false, msg: '文章发布失败！' });
            reject();
          } else {
            res.json({ result: true, msg: '文章发布成功！' });
            resolve();
          }
        });
      });
    }
       // 操作
    fn1().then(fn2).then(fn3).catch((err) => { console.error(err); });
  },
// 删除文章
  articledelete: function (req, res, fields) {
    let param;
    function fn1() {
      return new Promise((resolve, reject) => {
        query(`DELETE FROM articles WHERE id = ${fields.aid} AND uid =${fields.uid}`, '', (err) => {
          if (err) {
            res.json({ result: false, msg: '删除文章失败！' });
            reject();
          } else {
            resolve();
          }
        });
      });
    }
    // 第二步获取栏目信息
    function fn2() {
      return new Promise((resolve, reject) => {
        query(`SELECT * FROM users WHERE id = ${fields.uid}`, '', (err, result) => {
          if (err) {
            res.json({ result: false, msg: '删除文章失败！' });
            reject();
          } else {
            param = result[0].nav;
            resolve();
          }
        });
      });
    }
    // 第三步对对应栏目下的文章数量-1
    function fn3() {
      return new Promise((resolve, reject) => {
        const Arry = JSON.parse(param);
        let changeindex;
        Arry.forEach((value, index) => {
          if (value.title == fields.columns) {
            changeindex = index;
          }
        });
        Arry[changeindex].num -= 1;
        const toString = JSON.stringify(Arry);
        query(`UPDATE users SET nav=? WHERE id =${fields.uid}`, toString, (err) => {
          if (err) {
            res.json({ result: false, msg: '删除文章失败！' });
            reject();
          } else {
            res.json({ result: true, msg: '删除文章成功！' });
            resolve();
          }
        });
      });
    }
       // 操作
    fn1().then(fn2).then(fn3).catch((err) => { console.error(err); });
  },
// 文章列表
  articlelist: function (req, res, fields) {
    let condition;
      // 动态拼接sql语句
    if (!fields.columns) {
      condition = `uid =${fields.uid}`;
    } else {
      condition = `uid = ${fields.uid} AND columns ="${fields.columns}"`;
    }
       // 获取文章数量
    function fn1() {
      return new Promise((resolve, reject) => {
        query(`SELECT COUNT(*) FROM articles WHERE ${condition}`, '', (err, result) => {
          if (err) {
            res.json({ result: false, msg: '获取文章列表失败！' });
            reject();
          } else {
            resolve(result[0]['COUNT(*)']);
          }
        });
      });
    }
      // 获取文章的内容
    function fn2(param) {
      return new Promise((resolve, reject) => {
        let pagesize;
        let page;
        if (fields.pagesize) {
          pagesize = fields.pagesize;
        } else {
          pagesize = 12;
        }
        if (fields.page) {
          page = fields.page;
        } else {
          page = 1;
        }
        query(`SELECT * FROM articles WHERE ${condition} LIMIT ${pagesize} OFFSET ${pagesize * (page - 1)}`, '', (err, result) => {
          if (err) {
            res.json({ result: false, msg: '获取文章列表失败！' });
            reject();
          } else {
            const dataArry = [];
            result.map((item) => {
              const onedata = {};
              onedata.title = item.title;
              onedata.digest = item.digest;
              onedata.columns = item.columns;
              onedata.hits = item.hits;
              onedata.limits = item.limits;
              onedata.aid = item.id;
              // onedata.updatatime = formatDate(new Date(item.updatatime));
              dataArry.push(onedata);
            });
            res.json({ result: true, msg: '获取文章列表成功！', total: param, data: dataArry });
            resolve();
          }
        });
      });
    }
      // 操作
    fn1().then(fn2).catch((err) => { console.error(err); });
  },
  // 文章详情
  articledetail: function (req, res, fields) {
    query(`SELECT * FROM articles WHERE id = ${fields.aid}`, '', (err, result) => {
      if (err) {
        res.json({ result: false, msg: '获取文章失败！' });
      } else {
        if (result.length === 0) {
          res.json({ result: false, msg: '获取文章失败！' });
          return;
        }
        if (result[0].uid !== fields.uid) {
          res.json({ result: false, msg: '获取文章失败！' });
          return;
        }
        res.json({ result: true,
          msg: '获取文章成功！',
          data: {
            // updatatime: formatDate(new Date(result[0].updatatime)),
            text: result[0].contents,
            title: result[0].title,
            columns: result[0].columns,
            digest: result[0].digest,
            hits: result[0].hits,
          } });
      }
    });
  },
  // 修改文章接口
  updataarticle: function (req, res, fields) {
    if (!fields.title || fields.title.length > 40) {
      res.json({ result: false, msg: '标题不能为空且长度小于40！' });
      return;
    }
    if (!fields.digest || fields.digest.length > 120) {
      res.json({ result: false, msg: '摘要不能为空且长度小于120!' });
      return;
    }
    if (!fields.columns || fields.columns === '选择栏目') {
      res.json({ result: false, msg: '栏目不能为空!' });
      return;
    }
    if (!fields.contents) {
      res.json({ result: false, msg: '内容不能为空！' });
      return;
    }
    const nowtime = new Date();
    const condition = `uid = ${fields.uid} AND id ="${fields.aid}"`;
    const data = [fields.title, fields.digest, fields.columns, fields.contents, nowtime];
    query(`UPDATE articles SET title=? ,digest=? ,columns=?,contents=?,updatatime=? WHERE ${condition}`, data, (err, result) => {
      if (err) {
        res.json({ result: false, msg: '更新文章失败！' });
      } else {
        if (result.changedRows === 0) {
          res.json({ result: false, msg: '更新文章失败！' });
          return;
        }
        res.json({ result: true, msg: '更新文章成功！' });
      }
    });
  },


};

