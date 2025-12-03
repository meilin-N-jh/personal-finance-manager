const fs = require('fs');
const path = require('path');
const { query } = require('./sqlite-connection');

async function runSeeds() {
  try {
    console.log('开始插入示例数据...');

    // 首先检查是否已经有数据
    const userCount = await query('SELECT COUNT(*) as count FROM users');
    if (userCount.rows[0].count > 0) {
      console.log('数据库中已有数据，跳过种子数据插入');
      return;
    }

    // 创建示例用户
    console.log('创建示例用户...');

    // 使用bcrypt加密密码
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('123456', 10);

    // 插入用户
    await query(`
      INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES
      (?, ?, ?, ?, ?)
    `, ['test', 'test@example.com', hashedPassword, '测试', '用户']);

    await query(`
      INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES
      (?, ?, ?, ?, ?)
    `, ['demo', 'demo@example.com', hashedPassword, '演示', '账户']);

    // 获取用户ID
    const testUser = await query('SELECT id FROM users WHERE username = ?', ['test']);
    const demoUser = await query('SELECT id FROM users WHERE username = ?', ['demo']);

    const testUserId = testUser.rows[0].id;
    const demoUserId = demoUser.rows[0].id;

    console.log(`创建用户成功: test (ID: ${testUserId}), demo (ID: ${demoUserId})`);

    // 创建分类
    console.log('创建支出分类...');
    await query(`
      INSERT INTO categories (user_id, name, description, type, color) VALUES
      (?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?)
    `, [
      testUserId, '餐饮', '餐厅、外卖、咖啡', 'expense', '#ff6b6b',
      testUserId, '交通', '公交、地铁、打车', 'expense', '#4ecdc4',
      testUserId, '购物', '服装、日用品', 'expense', '#45b7d1',
      testUserId, '娱乐', '电影、游戏、旅行', 'expense', '#96ceb4',
      testUserId, '医疗', '看病、买药', 'expense', '#dda0dd'
    ]);

    console.log('创建收入分类...');
    await query(`
      INSERT INTO categories (user_id, name, description, type, color) VALUES
      (?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?)
    `, [
      testUserId, '工资', '月薪、奖金', 'income', '#2ecc71',
      testUserId, '兼职', '副业收入', 'income', '#f39c12'
    ]);

    // 创建账户
    console.log('创建账户...');
    await query(`
      INSERT INTO accounts (user_id, name, type, balance, currency) VALUES
      (?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?)
    `, [
      testUserId, '现金', 'cash', 1000.00, 'CNY',
      testUserId, '储蓄卡', 'bank_account', 5000.00, 'CNY',
      testUserId, '信用卡', 'credit_card', -1000.00, 'CNY'
    ]);

    // 获取账户和分类ID
    const cashAccount = await query('SELECT id FROM accounts WHERE user_id = ? AND name = ?', [testUserId, '现金']);
    const bankAccount = await query('SELECT id FROM accounts WHERE user_id = ? AND name = ?', [testUserId, '储蓄卡']);
    const creditAccount = await query('SELECT id FROM accounts WHERE user_id = ? AND name = ?', [testUserId, '信用卡']);

    const foodCategory = await query('SELECT id FROM categories WHERE user_id = ? AND name = ?', [testUserId, '餐饮']);
    const salaryCategory = await query('SELECT id FROM categories WHERE user_id = ? AND name = ?', [testUserId, '工资']);

    // 创建示例交易
    console.log('创建示例交易...');
    await query(`
      INSERT INTO transactions (user_id, account_id, category_id, amount, description, type, date, notes) VALUES
      (?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      testUserId, salaryCategory.rows[0].id, salaryCategory.rows[0].id, 5000.00, '月工资', 'income', new Date().toISOString(), '每月固定收入',
      testUserId, foodCategory.rows[0].id, foodCategory.rows[0].id, -50.00, '午餐', 'expense', new Date().toISOString(), '公司附近餐厅',
      testUserId, cashAccount.rows[0].id, foodCategory.rows[0].id, -30.00, '咖啡', 'expense', new Date().toISOString(), '星巴克',
      testUserId, bankAccount.rows[0].id, foodCategory.rows[0].id, -200.00, '超市购物', 'expense', new Date().toISOString(), '周末采购',
      testUserId, creditAccount.rows[0].id, foodCategory.rows[0].id, -100.00, '外卖', 'expense', new Date().toISOString(), '晚餐外卖'
    ]);

    console.log('所有示例数据插入完成！');
    console.log('\n演示账户信息：');
    console.log('用户名: test, 密码: 123456');
    console.log('用户名: demo, 密码: 123456');

  } catch (error) {
    console.error('种子数据插入失败:', error);
    throw error;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  runSeeds()
    .then(() => {
      console.log('种子数据插入成功');
      process.exit(0);
    })
    .catch((error) => {
      console.error('种子数据插入失败:', error);
      process.exit(1);
    });
}

module.exports = { runSeeds };