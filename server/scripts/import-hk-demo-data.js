const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/finance_manager',
});

// Hong Kong CityU student demo data
const hkDemoData = {
  user: {
    username: 'cityu boy',
    password: '123456',
    email: 'cityu.boy@cityu.edu.hk',
    firstName: 'CityU',
    lastName: 'Student'
  },

  accounts: [
    {
      name: 'Bank of China (HK) Savings',
      type: 'savings',
      balance: 15000.00,
      currency: 'HKD'
    },
    {
      name: 'HSBC Premier Account',
      type: 'checking',
      balance: 8500.00,
      currency: 'HKD'
    },
    {
      name: 'AlipayHK Wallet',
      type: 'savings',
      balance: 2500.00,
      currency: 'HKD'
    },
    {
      name: 'Octopus Card',
      type: 'cash',
      balance: 350.00,
      currency: 'HKD'
    },
    {
      name: 'Hang Seng Bank Credit Card',
      type: 'credit_card',
      balance: -1200.00,
      currency: 'HKD'
    }
  ],

  categories: [
    // Expense categories
    { name: 'Food & Dining', type: 'expense', color: '#FF6B6B', icon: 'utensils' },
    { name: 'Transportation', type: 'expense', color: '#4ECDC4', icon: 'car' },
    { name: 'Shopping', type: 'expense', color: '#95E77E', icon: 'shopping-bag' },
    { name: 'Entertainment', type: 'expense', color: '#FFE66D', icon: 'gamepad-2' },
    { name: 'Education', type: 'expense', color: '#A8DADC', icon: 'book' },
    { name: 'Utilities', type: 'expense', color: '#F4A261', icon: 'home' },
    { name: 'Healthcare', type: 'expense', color: '#E76F51', icon: 'heart' },
    { name: 'Social', type: 'expense', color: '#F72585', icon: 'users' },

    // Income categories
    { name: 'Monthly Allowance', type: 'income', color: '#06FFA5', icon: 'wallet' },
    { name: 'Part-time Job', type: 'income', color: '#FFB700', icon: 'briefcase' },
    { name: 'Scholarship', type: 'income', color: '#00F5FF', icon: 'award' },
    { name: 'Tutoring', type: 'income', color: '#C77DFF', icon: 'graduation-cap' }
  ]
};

// Generate Hong Kong student life transactions
function generateHKTransactions(accounts, categories) {
  const transactions = [];
  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  // Generate past 2 months of transactions
  const today = new Date();
  const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());

  // Monthly allowance (at the beginning of each month)
  for (let i = 0; i < 3; i++) {
    const allowanceDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
    transactions.push({
      description: 'Monthly allowance from parents',
      amount: 8000.00,
      type: 'income',
      date: allowanceDate.toISOString().split('T')[0],
      category_id: incomeCategories.find(c => c.name === 'Monthly Allowance').id,
      account_id: accounts.find(a => a.name === 'Bank of China (HK) Savings').id
    });
  }

  // Part-time job income (weekly)
  for (let i = 0; i < 8; i++) {
    const jobDate = new Date(twoMonthsAgo.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
    transactions.push({
      description: 'Part-time work at campus library',
      amount: 800.00,
      type: 'income',
      date: jobDate.toISOString().split('T')[0],
      category_id: incomeCategories.find(c => c.name === 'Part-time Job').id,
      account_id: accounts.find(a => a.name === 'HSBC Premier Account').id
    });
  }

  // Random daily expenses
  for (let i = 0; i < 60; i++) {
    const date = new Date(twoMonthsAgo.getTime() + Math.random() * (today.getTime() - twoMonthsAgo.getTime()));
    const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
    let account = accounts.filter(a => a.type !== 'credit_card')[Math.floor(Math.random() * (accounts.length - 1))];

    let amount, description;

    switch (category.name) {
      case 'Food & Dining':
        const foodOptions = [
          'Lunch at CityU canteen',
          'Dinner at Mong Kok restaurant',
          'Bubble tea with friends',
          'Late-night supper at Causeway Bay',
          'Breakfast at campus café',
          'Dim sum weekend treat'
        ];
        description = foodOptions[Math.floor(Math.random() * foodOptions.length)];
        amount = (Math.random() * 80 + 20).toFixed(2);
        break;

      case 'Transportation':
        const transportOptions = [
          'MTR monthly pass top-up',
          'Bus to Kowloon Tong',
          'Taxi to Central',
          'MTR to Admiralty',
          'Minibus to Sha Tin'
        ];
        description = transportOptions[Math.floor(Math.random() * transportOptions.length)];
        amount = (Math.random() * 50 + 5).toFixed(2);
        if (description.includes('Octopus')) {
          account = accounts.find(a => a.name === 'Octopus Card');
        }
        break;

      case 'Shopping':
        const shoppingOptions = [
          'Textbooks at CityU bookstore',
          'Clothes at H&M',
          'Electronics at Mong Kok Computer Centre',
          'Groceries at Wellcome超市',
          'Stationery at Popular',
          'Skincare at SASA'
        ];
        description = shoppingOptions[Math.floor(Math.random() * shoppingOptions.length)];
        amount = (Math.random() * 500 + 100).toFixed(2);
        if (amount > 300) {
          account = accounts.find(a => a.name === 'Hang Seng Bank Credit Card');
        }
        break;

      case 'Entertainment':
        const entertainmentOptions = [
          'Movie tickets at UA Cinema',
          'Karaoke with classmates',
          'Concert at Hong Kong Coliseum',
          'Gaming credits',
          'Netflix subscription',
          'Board games cafe'
        ];
        description = entertainmentOptions[Math.floor(Math.random() * entertainmentOptions.length)];
        amount = (Math.random() * 200 + 50).toFixed(2);
        break;

      case 'Education':
        const educationOptions = [
          'Course materials printing',
          'Online courses subscription',
          'Professional certification exam',
          'Reference books',
          'Workshop registration'
        ];
        description = educationOptions[Math.floor(Math.random() * educationOptions.length)];
        amount = (Math.random() * 300 + 100).toFixed(2);
        break;

      case 'Utilities':
        const utilityOptions = [
          'Mobile phone bill (3HK)',
          'Home internet (PCCW)',
          'Electricity bill',
          'Water bill'
        ];
        description = utilityOptions[Math.floor(Math.random() * utilityOptions.length)];
        amount = (Math.random() * 300 + 50).toFixed(2);
        account = accounts.find(a => a.name === 'Hang Seng Bank Credit Card');
        break;

      default:
        description = 'Other expense';
        amount = (Math.random() * 100 + 20).toFixed(2);
    }

    transactions.push({
      description,
      amount: parseFloat(amount),
      type: 'expense',
      date: date.toISOString().split('T')[0],
      category_id: category.id,
      account_id: account.id
    });
  }

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Generate Hong Kong student budgets
function generateHKBudgets(categories) {
  const budgets = [];
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const currentMonth = new Date();
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

  expenseCategories.forEach(category => {
    let budgetAmount;
    switch (category.name) {
      case 'Food & Dining':
        budgetAmount = 2500.00;  // HK student food budget
        break;
      case 'Transportation':
        budgetAmount = 600.00;   // MTR and public transport
        break;
      case 'Shopping':
        budgetAmount = 1000.00;  // Shopping and personal items
        break;
      case 'Entertainment':
        budgetAmount = 400.00;   // Movies, social activities
        break;
      case 'Education':
        budgetAmount = 300.00;   // Books, supplies
        break;
      case 'Utilities':
        budgetAmount = 500.00;   // Phone, internet, utilities
        break;
      case 'Healthcare':
        budgetAmount = 200.00;   // Medical expenses
        break;
      case 'Social':
        budgetAmount = 300.00;   // Social activities
        break;
      default:
        budgetAmount = 200.00;
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

// Main function
async function importHKDemoData() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('🇭🇰 Creating Hong Kong CityU student demo data...');

    console.log('👤 Creating user: cityu boy');
    // Create user
    const hashedPassword = await bcrypt.hash(hkDemoData.user.password, 10);
    const userResult = await client.query(
      'INSERT INTO users (username, password_hash, email, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [hkDemoData.user.username, hashedPassword, hkDemoData.user.email, hkDemoData.user.firstName, hkDemoData.user.lastName]
    );
    const userId = userResult.rows[0].id;

    console.log('💳 Creating Hong Kong bank accounts...');
    // Create accounts
    const accountPromises = hkDemoData.accounts.map(async (account) => {
      const result = await client.query(
        'INSERT INTO accounts (user_id, name, type, balance, currency) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [userId, account.name, account.type, account.balance, account.currency]
      );
      return { ...account, id: result.rows[0].id };
    });
    const createdAccounts = await Promise.all(accountPromises);

    console.log('🏷️  Creating expense and income categories...');
    // Create categories
    const categoryPromises = hkDemoData.categories.map(async (category) => {
      const result = await client.query(
        'INSERT INTO categories (user_id, name, type, color, icon) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [userId, category.name, category.type, category.color, category.icon]
      );
      return { ...category, id: result.rows[0].id };
    });
    const createdCategories = await Promise.all(categoryPromises);

    console.log('💰 Generating Hong Kong student life transactions...');
    // Generate transactions
    const transactions = generateHKTransactions(createdAccounts, createdCategories);
    const transactionPromises = transactions.map(transaction =>
      client.query(
        'INSERT INTO transactions (user_id, description, amount, type, date, category_id, account_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [userId, transaction.description, transaction.amount, transaction.type, transaction.date, transaction.category_id, transaction.account_id]
      )
    );
    await Promise.all(transactionPromises);

    console.log('📊 Creating monthly budgets...');
    // Create budgets
    const budgets = generateHKBudgets(createdCategories);
    const budgetPromises = budgets.map(budget =>
      client.query(
        'INSERT INTO budgets (user_id, category_id, amount, period, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6)',
        [userId, budget.category_id, budget.amount, budget.period, budget.start_date, budget.end_date]
      )
    );
    await Promise.all(budgetPromises);

    await client.query('COMMIT');

    console.log('\n✅ Hong Kong CityU student demo data imported successfully!');
    console.log('\n📊 Data Summary:');
    console.log(`   👤 User: ${hkDemoData.user.username} (${hkDemoData.user.email})`);
    console.log(`   💳 Accounts: ${createdAccounts.length} accounts`);
    console.log(`   🏷️  Categories: ${createdCategories.length} categories`);
    console.log(`   💰 Transactions: ${transactions.length} transactions`);
    console.log(`   📊 Budgets: ${budgets.length} budgets`);
    console.log(`   💰 Currency: HKD (default)`);

    console.log('\n🔐 Login Credentials:');
    console.log('   Username: cityu boy');
    console.log('   Password: 123456');

    console.log('\n🎓 Student Profile:');
    console.log('   • City University of Hong Kong student');
    console.log('   • Monthly allowance: HK$8,000');
    console.log('   • Part-time job: HK$800/week');
    console.log('   • 5 bank accounts including Octopus card');
    console.log('   • HKD currency setup');

    console.log('\n🎬 Video Recording Suggestions:');
    console.log('   1. Login with cityu boy / 123456');
    console.log('   2. Show dashboard with HKD currency');
    console.log('   3. Review Hong Kong bank accounts');
    console.log('   4. Browse local transaction categories');
    console.log('   5. Check monthly budgets in HKD');
    console.log('   6. Add a new transaction (e.g., MTR ride)');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Import failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run import
if (require.main === module) {
  importHKDemoData()
    .then(() => {
      console.log('\n🎉 Hong Kong demo data ready for video recording!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Error during import:', error);
      process.exit(1);
    });
}

module.exports = importHKDemoData;