const fs = require('fs');
const path = require('path');
const { pool } = require('./connection');

async function runSeeds() {
  try {
    console.log('开始插入示例数据...');

    // 读取种子数据文件
    const seedsDir = path.join(__dirname, '../../seeds');
    const seedFiles = fs.readdirSync(seedsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of seedFiles) {
      console.log(`执行种子文件: ${file}`);

      const filePath = path.join(seedsDir, file);
      const seedSQL = fs.readFileSync(filePath, 'utf8');

      // 开始事务
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(seedSQL);
        await client.query('COMMIT');
        console.log(`种子文件 ${file} 执行成功`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }

    console.log('所有示例数据插入完成！');
    console.log('\n演示账户信息：');
    console.log('用户名: demo_user, 密码: demo123');
    console.log('用户名: student_user, 密码: demo123');
  } catch (error) {
    console.error('种子数据插入失败:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  runSeeds();
}

module.exports = { runSeeds };