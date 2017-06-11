const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 100,
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'linwb',
});

// sql语句封装
const query = (sql, values, callback) => {
  pool.getConnection((err, conn) => {
    if (err) {
      throw err;
    } else {
      conn.query(sql, values, (error, result, fields) => {
        conn.release(); //  释放连接
        callback(error, result, fields);
      });
    }
  });
};
//  conn导出更多方法
const conn = (callback) => {
  pool.getConnection((err, connect) => {
    if (err) {
      throw err;
    } else {
      return callback(connect);
    }
  });
};

exports.query = query;
exports.conn = conn;
