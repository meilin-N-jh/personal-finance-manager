const fs = require('fs');
const path = require('path');
const { pool } = require('./connection');

async function runMigrations() {
  try {
    console.log('开始运行数据库迁移...');

    // 创建迁移记录表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 读取迁移文件
    const migrationsDir = path.join(__dirname, '../../migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    // 获取已执行的迁移
    const executedResult = await pool.query('SELECT filename FROM migrations');
    const executedFiles = executedResult.rows.map(row => row.filename);

    // 执行未执行的迁移
    for (const file of migrationFiles) {
      if (!executedFiles.includes(file)) {
        console.log(`执行迁移: ${file}`);

        const filePath = path.join(migrationsDir, file);
        const migrationSQL = fs.readFileSync(filePath, 'utf8');

        // 开始事务
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          await client.query(migrationSQL);
          await client.query(
            'INSERT INTO migrations (filename) VALUES ($1)',
            [file]
          );
          await client.query('COMMIT');
          console.log(`迁移 ${file} 执行成功`);
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        } finally {
          client.release();
        }
      }
    }

    console.log('所有迁移执行完成！');
  } catch (error) {
    console.error('迁移执行失败:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };