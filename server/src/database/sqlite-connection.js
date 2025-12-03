const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// SQLite数据库文件路径
const dbPath = path.join(__dirname, '../../data/finance_manager.db');

// 创建数据库目录（如果不存在）
const fs = require('fs');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 创建SQLite数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// 启用外键约束
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');
});

// 包装查询方法以匹配PostgreSQL的API
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          rows: rows,
          rowCount: rows.length
        });
      }
    });
  });
};

module.exports = { query, db };