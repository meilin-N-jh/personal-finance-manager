const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// 数据库连接
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/finance_manager',
});

// 演示数据
const demoData = {
  user: {
    username: 'testuser',
    password: '123456',
    email: 'demo@example.com',
    firstName: '张',
    lastName: '三'
  },

  accounts: [
    {
      name: '工商银行储蓄卡',
      type: 'checking',
      balance: 15000.00
    },
    {
      name: '支付宝余额宝',
      type: 'savings',
      balance: 8500.00
    },
    {
      name: '招商银行信用卡',
      type: 'credit_card',
      balance: -2500.00
    },
    {
      name: '股票投资账户',
      type: 'investment',
      balance: 28000.00
    },
    {
      name: '房屋贷款',
      type: 'cash', // 使用cash表示负债
      balance: -350000.00
    }
  ],

  categories: [
    // 支出类别
    { name: '餐饮美食', type: 'expense', color: '#FF6B6B', icon: 'utensils' },
    { name: '交通出行', type: 'expense', color: '#4ECDC4', icon: 'car' },
    { name: '购物消费', type: 'expense', color: '#95E77E', icon: 'shopping-bag' },
    { name: '娱乐休闲', type: 'expense', color: '#FFE66D', icon: 'gamepad-2' },
    { name: '学习教育', type: 'expense', color: '#A8DADC', icon: 'book' },
    { name: '生活缴费', type: 'expense', color: '#F4A261', icon: 'home' },
    { name: '医疗保健', type: 'expense', color: '#E76F51', icon: 'award' },
    { name: '人情社交', type: 'expense', color: '#F72585', icon: 'wallet' },

    // 收入类别
    { name: '工资收入', type: 'income', color: '#06FFA5', icon: 'briefcase' },
    { name: '投资理财', type: 'income', color: '#FFB700', icon: 'trending-up' },
    { name: '兼职收入', type: 'income', color: '#00F5FF', icon: 'pen-tool' },
    { name: '其他收入', type: 'income', color: '#C77DFF', icon: 'award' }
  ]
};

// 生成交易记录
function generateTransactions(accounts, categories) {
  const transactions = [];
  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  // 生成过去3个月的交易记录
  const today = new Date();
  const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());

  for (let i = 0; i < 120; i++) {
    const date = new Date(threeMonthsAgo.getTime() + Math.random() * (today.getTime() - threeMonthsAgo.getTime()));
    const isIncome = Math.random() > 0.7; // 30%概率是收入

    const category = isIncome
      ? incomeCategories[Math.floor(Math.random() * incomeCategories.length)]
      : expenseCategories[Math.floor(Math.random() * expenseCategories.length)];

    const account = accounts[Math.floor(Math.random() * accounts.length)];

    let amount, description;

    if (isIncome) {
      amount = (Math.random() * 10000 + 1000).toFixed(2);
      switch (category.name) {
        case '工资收入':
          description = '月度工资';
          amount = '18000.00';
          break;
        case '投资理财':
          description = '股票分红';
          break;
        case '兼职收入':
          description = '自由职业项目';
          break;
        default:
          description = '其他收入';
      }
    } else {
      amount = (Math.random() * 800 + 50).toFixed(2);
      switch (category.name) {
        case '餐饮美食':
          description = ['午餐', '晚餐', '咖啡', '外卖', '聚餐'][Math.floor(Math.random() * 5)];
          break;
        case '交通出行':
          description = ['地铁', '打车', '加油', '停车费', '火车票'][Math.floor(Math.random() * 5)];
          break;
        case '购物消费':
          description = ['淘宝购物', '服装', '日用品', '电子产品', '化妆品'][Math.floor(Math.random() * 5)];
          break;
        case '娱乐休闲':
          description = ['电影票', '游戏充值', 'KTV', '旅游', '健身'][Math.floor(Math.random() * 5)];
          break;
        case '学习教育':
          description = ['在线课程', '书籍', '培训费', '考试报名'][Math.floor(Math.random() * 4)];
          break;
        case '生活缴费':
          description = ['电费', '水费', '燃气费', '物业费', '网费'][Math.floor(Math.random() * 5)];
          break;
        default:
          description = '其他支出';
      }
    }

    transactions.push({
      description,
      amount: parseFloat(amount),
      type: isIncome ? 'income' : 'expense',
      date: date.toISOString().split('T')[0],
      category_id: category.id,
      account_id: account.id
    });
  }

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// 生成预算数据
function generateBudgets(categories) {
  const budgets = [];
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const currentMonth = new Date();
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

  expenseCategories.forEach(category => {
    let budgetAmount;
    switch (category.name) {
      case '餐饮美食':
        budgetAmount = 2000.00;
        break;
      case '交通出行':
        budgetAmount = 800.00;
        break;
      case '购物消费':
        budgetAmount = 1500.00;
        break;
      case '娱乐休闲':
        budgetAmount = 600.00;
        break;
      case '学习教育':
        budgetAmount = 500.00;
        break;
      case '生活缴费':
        budgetAmount = 1200.00;
        break;
      case '医疗保健':
        budgetAmount = 400.00;
        break;
      case '人情社交':
        budgetAmount = 800.00;
        break;
      default:
        budgetAmount = 500.00;
    }

    budgets.push({
      category_id: category.id,
      amount: budgetAmount,
      period: 'monthly',
      start_date: startOfMonth.toISOString().split('T')[0],
      end_date: endOfMonth.toISOString().split('T')[0]
    });
  });

  return budgets;
}

// 主函数
async function importDemoData() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('🗑️  清理现有数据...');
    // 删除现有数据（按照外键依赖顺序）
    await client.query('DELETE FROM transactions');
    await client.query('DELETE FROM budgets');
    await client.query('DELETE FROM categories');
    await client.query('DELETE FROM accounts');
    await client.query('DELETE FROM users');

    console.log('👤 创建用户...');
    // 创建用户
    const hashedPassword = await bcrypt.hash(demoData.user.password, 10);
    const userResult = await client.query(
      'INSERT INTO users (username, password_hash, email, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [demoData.user.username, hashedPassword, demoData.user.email, demoData.user.firstName, demoData.user.lastName]
    );
    const userId = userResult.rows[0].id;

    console.log('💳 创建账户...');
    // 创建账户
    const accountPromises = demoData.accounts.map(async (account) => {
      const result = await client.query(
        'INSERT INTO accounts (user_id, name, type, balance) VALUES ($1, $2, $3, $4) RETURNING id',
        [userId, account.name, account.type, account.balance]
      );
      return { ...account, id: result.rows[0].id };
    });
    const createdAccounts = await Promise.all(accountPromises);

    console.log('🏷️  创建类别...');
    // 创建类别
    const categoryPromises = demoData.categories.map(async (category) => {
      const result = await client.query(
        'INSERT INTO categories (user_id, name, type, color, icon) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [userId, category.name, category.type, category.color, category.icon]
      );
      return { ...category, id: result.rows[0].id };
    });
    const createdCategories = await Promise.all(categoryPromises);

    console.log('💰 生成交易记录...');
    // 生成交易记录
    const transactions = generateTransactions(createdAccounts, createdCategories);
    const transactionPromises = transactions.map(transaction =>
      client.query(
        'INSERT INTO transactions (user_id, description, amount, type, date, category_id, account_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [userId, transaction.description, transaction.amount, transaction.type, transaction.date, transaction.category_id, transaction.account_id]
      )
    );
    await Promise.all(transactionPromises);

    console.log('📊 创建预算...');
    // 创建预算
    const budgets = generateBudgets(createdCategories);
    const budgetPromises = budgets.map(budget =>
      client.query(
        'INSERT INTO budgets (user_id, category_id, amount, period, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6)',
        [userId, budget.category_id, budget.amount, budget.period, budget.start_date, budget.end_date]
      )
    );
    await Promise.all(budgetPromises);

    await client.query('COMMIT');

    console.log('\n✅ 演示数据导入成功！');
    console.log('\n📊 数据统计:');
    console.log(`   👤 用户: ${demoData.user.username}`);
    console.log(`   💳 账户: ${createdAccounts.length} 个`);
    console.log(`   🏷️  类别: ${createdCategories.length} 个`);
    console.log(`   💰 交易记录: ${transactions.length} 条`);
    console.log(`   📊 预算: ${budgets.length} 个`);

    console.log('\n💡 视频录制建议:');
    console.log('   1. 登录: testuser / 123456');
    console.log('   2. 仪表板查看总资产和月度统计');
    console.log('   3. 添加新交易记录');
    console.log('   4. 查看不同账户的余额');
    console.log('   5. 检查预算使用情况');
    console.log('   6. 自定义类别管理');
    console.log('   7. 个人资料设置');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ 导入失败:', error);
    throw error;
  } finally {
    client.release();
  }
}

// 运行导入
if (require.main === module) {
  importDemoData()
    .then(() => {
      console.log('\n🎉 演示数据准备完成，可以开始录制视频了！');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 导入过程中发生错误:', error);
      process.exit(1);
    });
}

module.exports = importDemoData;