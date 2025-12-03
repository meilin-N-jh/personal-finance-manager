const fs = require('fs');
const path = require('path');
const { db } = require('./sqlite-connection');

async function runSQLiteMigrations() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      console.log('开始运行SQLite数据库迁移...');

      // 读取迁移文件
      const migrationsDir = path.join(__dirname, '../../migrations');
      let migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort();

      // 优先使用SQLite版本
      const sqliteFiles = migrationFiles.filter(file => file.includes('sqlite'));
      if (sqliteFiles.length > 0) {
        migrationFiles = sqliteFiles;
      }

      // 执行迁移文件
      let completed = 0;
      const total = migrationFiles.length;

      migrationFiles.forEach((file, index) => {
        console.log(`执行迁移: ${file}`);
        const filePath = path.join(migrationsDir, file);
        const migrationSQL = fs.readFileSync(filePath, 'utf8');

        db.exec(migrationSQL, (err) => {
          if (err) {
            console.error(`迁移 ${file} 执行失败:`, err);
            db.close();
            return reject(err);
          }

          console.log(`迁移 ${file} 执行成功`);
          completed++;

          if (completed === total) {
            console.log('所有SQLite迁移执行完成！');
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
  runSQLiteMigrations()
    .then(() => {
      console.log('迁移成功完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('迁移失败:', error);
      process.exit(1);
    });
}

module.exports = { runSQLiteMigrations };