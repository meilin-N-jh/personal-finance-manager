const { query } = require('../src/database/connection');

async function checkBudgetData() {
  try {
    console.log('🔍 Checking budget data...');

    // Find the demo user
    const userResult = await query('SELECT id, username FROM users WHERE username = $1', ['cityu boy']);

    if (userResult.rows.length === 0) {
      console.log('❌ Demo user not found');
      return;
    }

    const userId = userResult.rows[0].id;
    console.log(`✅ Found demo user: ${userResult.rows[0].username} (ID: ${userId})`);

    // Check budgets
    console.log('\n💰 Checking budgets:');
    const budgetResult = await query('SELECT b.*, c.name as category_name FROM budgets b LEFT JOIN categories c ON b.category_id = c.id WHERE b.user_id = $1', [userId]);

    if (budgetResult.rows.length === 0) {
      console.log('❌ No budgets found');
    } else {
      console.log(`✅ Found ${budgetResult.rows.length} budgets:`);
      budgetResult.rows.forEach(budget => {
        console.log(`  - ${budget.category_name}: HK$${budget.amount} (${budget.period})`);
      });

      const totalBudgeted = budgetResult.rows.reduce((sum, b) => sum + parseFloat(b.amount), 0);
      console.log(`\n📊 Total Budgeted: HK$${totalBudgeted.toFixed(2)}`);
    }

    // Check transactions for budgeted categories
    console.log('\n💸 Checking transactions for budgeted categories:');
    const transactionResult = await query(
      `SELECT t.*, c.name as category_name
       FROM transactions t
       INNER JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1 AND t.type = 'expense'
       AND EXISTS (SELECT 1 FROM budgets b WHERE b.category_id = t.category_id AND b.user_id = t.user_id)
       ORDER BY t.date DESC`,
      [userId]
    );

    if (transactionResult.rows.length === 0) {
      console.log('❌ No transactions found for budgeted categories');
    } else {
      console.log(`✅ Found ${transactionResult.rows.length} transactions:`);
      transactionResult.rows.forEach(transaction => {
        console.log(`  - ${transaction.category_name}: ${transaction.description} - HK$${transaction.amount}`);
      });

      const totalSpent = transactionResult.rows.reduce((sum, t) => sum + parseFloat(t.amount), 0);
      console.log(`\n📊 Total Spent: HK$${totalSpent.toFixed(2)}`);
    }

    // Check if API route is properly configured
    console.log('\n🔧 Checking API route...');
    const express = require('express');
    const budgetsRouter = require('../src/routes/budgets');

    console.log('✅ Budget routes module loaded');
    console.log('Routes:', budgetsRouter.stack ? budgetsRouter.stack.map(layer => layer.route?.path).filter(Boolean) : 'No routes found');

  } catch (error) {
    console.error('❌ Error checking budget data:', error);
  } finally {
    process.exit(0);
  }
}

checkBudgetData();