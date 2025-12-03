const fs = require('fs');
const path = require('path');
const { db } = require('./sqlite-connection');

async function runSQLiteSeeds() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      console.log('开始插入SQLite示例数据...');

      // 读取种子数据文件
      const seedsDir = path.join(__dirname, '../../seeds');
      let seedFiles = fs.readdirSync(seedsDir)
        .filter(file => file.endsWith('.sql'))
        .sort();

      // 使用普通种子文件（SQLite版本）
      const sqliteFiles = seedFiles.filter(file => !file.includes('postgres'));
      if (sqliteFiles.length > 0) {
        seedFiles = sqliteFiles;
      }

      // 执行种子文件
      let completed = 0;
      const total = seedFiles.length;

      if (total === 0) {
        console.log('没有找到种子数据文件');
        db.close();
        return resolve();
      }

      seedFiles.forEach((file, index) => {
        console.log(`执行种子文件: ${file}`);
        const filePath = path.join(seedsDir, file);
        let seedSQL = fs.readFileSync(filePath, 'utf8');

        // 转换PostgreSQL语法到SQLite
        seedSQL = seedSQL
          .replace(/SERIAL PRIMARY KEY/g, 'INTEGER PRIMARY KEY AUTOINCREMENT')
          .replace(/\$[0-9]/g, '?')
          .replace(/DEFAULT CURRENT_TIMESTAMP/g, 'DEFAULT datetime("now")')
          .replace(/SETVAL\(.*?\);/g, '')
          .replace(/SELECT setval\(.*?\);/g, '');

        db.exec(seedSQL, (err) => {
          if (err) {
            console.error(`种子文件 ${file} 执行失败:`, err);
            db.close();
            return reject(err);
          }

          console.log(`种子文件 ${file} 执行成功`);
          completed++;

          if (completed === total) {
            console.log('所有SQLite示例数据插入完成！');
            console.log('\n演示账户信息：');
            console.log('用户名: demo_user, 密码: demo123');
            console.log('用户名: student_user, 密码: demo123');
            db.close();
            resolve();
          }
        });
      });
    });
  });
}

// 如果直接运行此脚本
if (require.main === module) {
  runSQLiteSeeds()
    .then(() => {
      console.log('种子数据成功插入');
      process.exit(0);
    })
    .catch((error) => {
      console.error('种子数据插入失败:', error);
      process.exit(1);
    });
}

module.exports = { runSQLiteSeeds };