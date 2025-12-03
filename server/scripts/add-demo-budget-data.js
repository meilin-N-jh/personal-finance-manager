const { query } = require('../src/database/connection');

async function addDemoBudgetData() {
  try {
    console.log('🔍 Finding demo user (cityu boy)...');

    // Find the demo user
    const userResult = await query('SELECT id FROM users WHERE username = $1', ['cityu boy']);

    if (userResult.rows.length === 0) {
      console.log('❌ Demo user not found');
      return;
    }

    const userId = userResult.rows[0].id;
    console.log(`✅ Found demo user with ID: ${userId}`);

    // Get or create categories
    console.log('🏷️ Managing categories...');

    const categories = [
      { name: 'Food & Dining', type: 'expense', color: '#FF6B6B', icon: '🍽️' },
      { name: 'Transportation', type: 'expense', color: '#4ECDC4', icon: '🚇' },
      { name: 'Shopping', type: 'expense', color: '#45B7D1', icon: '🛍️' },
      { name: 'Entertainment', type: 'expense', color: '#96CEB4', icon: '🎮' },
      { name: 'Utilities', type: 'expense', color: '#FFEAA7', icon: '💡' },
      { name: 'Salary', type: 'income', color: '#74B9FF', icon: '💰' },
      { name: 'Scholarship', type: 'income', color: '#A29BFE', icon: '🎓' }
    ];

    const categoryIds = {};

    for (const category of categories) {
      // Check if category exists
      const existingCategory = await query(
        'SELECT id FROM categories WHERE name = $1 AND user_id = $2',
        [category.name, userId]
      );

      if (existingCategory.rows.length > 0) {
        categoryIds[category.name] = existingCategory.rows[0].id;
        console.log(`  ✓ Found existing category: ${category.name}`);
      } else {
        // Create new category
        const newCategory = await query(
          'INSERT INTO categories (name, type, color, icon, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [category.name, category.type, category.color, category.icon, userId]
        );
        categoryIds[category.name] = newCategory.rows[0].id;
        console.log(`  + Created new category: ${category.name}`);
      }
    }

    // Create budgets for expense categories
    console.log('💼 Creating budgets...');

    const budgets = [
      { category: 'Food & Dining', amount: 3000, period: 'monthly' },
      { category: 'Transportation', amount: 800, period: 'monthly' },
      { category: 'Shopping', amount: 1500, period: 'monthly' },
      { category: 'Entertainment', amount: 1000, period: 'monthly' },
      { category: 'Utilities', amount: 600, period: 'monthly' }
    ];

    for (const budget of budgets) {
      // Check if budget already exists
      const existingBudget = await query(
        'SELECT id FROM budgets WHERE category_id = $1 AND user_id = $2',
        [categoryIds[budget.category], userId]
      );

      if (existingBudget.rows.length === 0) {
        const startDate = new Date().toISOString().split('T')[0];
        const endDate = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0];

        await query(
          'INSERT INTO budgets (user_id, category_id, amount, period, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6)',
          [userId, categoryIds[budget.category], budget.amount, budget.period, startDate, endDate]
        );
        console.log(`  + Created budget: ${budget.category} - HK$${budget.amount}`);
      } else {
        console.log(`  ✓ Budget already exists: ${budget.category}`);
      }
    }

    // Create some transactions to show spending
    console.log('💸 Creating sample transactions...');

    const transactions = [
      { category: 'Food & Dining', description: 'Lunch at CityU Canteen', amount: 45, type: 'expense' },
      { category: 'Food & Dining', description: 'Dinner at Café de Coral', amount: 68, type: 'expense' },
      { category: 'Food & Dining', description: 'Grocery Shopping at ParknShop', amount: 320, type: 'expense' },
      { category: 'Transportation', description: 'MTR Monthly Pass', amount: 480, type: 'expense' },
      { category: 'Transportation', description: 'Bus Top-up', amount: 100, type: 'expense' },
      { category: 'Shopping', description: 'New Shoes from Uniqlo', amount: 450, type: 'expense' },
      { category: 'Entertainment', description: 'Movie Tickets', amount: 120, type: 'expense' },
      { category: 'Entertainment', description: 'Netflix Subscription', amount: 78, type: 'expense' },
      { category: 'Utilities', description: 'Electricity Bill', amount: 280, type: 'expense' },
      { category: 'Utilities', description: 'Water Bill', amount: 150, type: 'expense' },
      { category: 'Salary', description: 'Part-time Job Salary', amount: 5000, type: 'income' },
      { category: 'Scholarship', description: 'CityU Scholarship', amount: 3000, type: 'income' }
    ];

    // Get user's accounts
    const accountsResult = await query('SELECT id FROM accounts WHERE user_id = $1 LIMIT 1', [userId]);

    if (accountsResult.rows.length === 0) {
      console.log('❌ No accounts found for user. Creating a default account...');

      const newAccount = await query(
        'INSERT INTO accounts (user_id, name, type, balance, currency) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [userId, 'Main Account', 'checking', 10000, 'HKD']
      );

      accountsResult.rows[0] = { id: newAccount.rows[0].id };
    }

    const accountId = accountsResult.rows[0].id;

    for (const transaction of transactions) {
      const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      await query(
        'INSERT INTO transactions (user_id, category_id, account_id, description, amount, type, date) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [userId, categoryIds[transaction.category], accountId, transaction.description, transaction.amount, transaction.type, date]
      );
      console.log(`  + Added transaction: ${transaction.description} - HK$${transaction.amount}`);
    }

    console.log('\n🎉 Demo budget data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Total Budgeted: HK$7,900`);
    console.log(`- Total Income: HK$8,000`);
    console.log(`- Sample Expenses: HK$2,151`);
    console.log(`- Net Cash Flow: HK$5,849`);

    console.log('\n💡 Budget Features to Demonstrate:');
    console.log('1. Budget Summary cards showing total budgeted, spent, and remaining');
    console.log('2. Individual budget progress bars with spending tracking');
    console.log('3. Visual indicators for budget overages');
    console.log('4. Create/Edit/Delete budget functionality');
    console.log('5. Category-based spending analysis');

  } catch (error) {
    console.error('❌ Error adding demo budget data:', error);
  } finally {
    process.exit(0);
  }
}

// Run the script
addDemoBudgetData();