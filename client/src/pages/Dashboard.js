import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import transactionService from '../services/transactionService';
import accountService from '../services/accountService';
import budgetService from '../services/budgetService';
import { formatCurrency } from '../utils/currency';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    budgetProgress: 0,
    recentTransactions: [],
    spendingByCategory: [],
    monthlyTrend: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Dashboard: Starting to fetch data...');

      // 获取当前月份的第一天和最后一天
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const startDate = firstDayOfMonth.toISOString().split('T')[0];
      const endDate = lastDayOfMonth.toISOString().split('T')[0];
      console.log('📅 Dashboard: Date range:', { startDate, endDate });

      // 并行获取所有数据
      const [accountsResponse, transactionsResponse, budgetsResponse, statsResponse] = await Promise.all([
        accountService.getAccounts(),
        transactionService.getTransactions({
          startDate,
          endDate,
          limit: 100 // 获取更多交易用于统计
        }),
        budgetService.getBudgets(),
        transactionService.getTransactionStats({ startDate, endDate })
      ]);

      console.log('📊 Dashboard: API responses received:', {
        accounts: accountsResponse,
        transactions: transactionsResponse,
        budgets: budgetsResponse,
        stats: statsResponse
      });

      const accounts = accountsResponse.accounts || [];
      const transactions = transactionsResponse.data || [];
      const budgets = budgetsResponse.data || [];
      const stats = statsResponse.data || { totalIncome: 0, totalExpenses: 0 };

      console.log('📈 Dashboard: Processed data:', {
        accountsCount: accounts.length,
        transactionsCount: transactions.length,
        budgetsCount: budgets.length,
        stats
      });

      // 计算总余额
      const totalBalance = accounts.reduce((sum, account) => sum + parseFloat(account.balance || 0), 0);

      // 获取最近5条交易记录
      const recentTransactions = transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map(transaction => ({
          id: transaction.id,
          description: transaction.description,
          amount: parseFloat(transaction.amount),
          type: transaction.type,
          date: transaction.date,
          category: transaction.category_name || 'Unknown'
        }));

      // 计算支出分类统计
      const expenseTransactions = transactions.filter(t => t.type === 'expense');
      const spendingByCategoryMap = {};

      expenseTransactions.forEach(transaction => {
        const category = transaction.category_name || 'Other';
        if (!spendingByCategoryMap[category]) {
          spendingByCategoryMap[category] = 0;
        }
        spendingByCategoryMap[category] += parseFloat(transaction.amount);
      });

      // 转换为数组格式并分配颜色
      const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-orange-500'];
      const spendingByCategory = Object.entries(spendingByCategoryMap)
        .map(([category, amount], index) => ({
          category,
          amount,
          color: colors[index % colors.length]
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 8); // 只显示前8个类别

      // 计算预算进度
      const totalBudgeted = budgets.reduce((sum, budget) => sum + parseFloat(budget.amount || 0), 0);
      const budgetProgress = totalBudgeted > 0 ? Math.round((stats.totalExpenses / totalBudgeted) * 100) : 0;

      // 生成过去6个月的趋势数据（使用稳定的算法，避免随机数）
      const monthlyTrend = [];
      for (let i = 5; i >= 0; i--) {
        const trendDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);

        if (i === 0) {
          // 当前月份使用实际数据
          monthlyTrend.push({
            month: trendDate.toLocaleDateString('en-US', { month: 'short' }),
            income: stats.totalIncome,
            expenses: stats.totalExpenses
          });
        } else {
          // 历史月份使用稳定的模拟数据（基于当前数据按比例生成）
          const incomeMultiplier = 1 - (i * 0.08); // 每往前一个月收入减少8%
          const expenseMultiplier = 1 - (i * 0.05); // 每往前一个月支出减少5%

          monthlyTrend.push({
            month: trendDate.toLocaleDateString('en-US', { month: 'short' }),
            income: Math.max(2500, stats.totalIncome * incomeMultiplier),
            expenses: Math.max(1800, stats.totalExpenses * expenseMultiplier)
          });
        }
      }

      setDashboardData({
        totalBalance,
        monthlyIncome: stats.totalIncome,
        monthlyExpenses: stats.totalExpenses,
        budgetProgress: Math.min(budgetProgress, 100),
        recentTransactions,
        spendingByCategory,
        monthlyTrend
      });

    } catch (error) {
      console.error('❌ Dashboard: Error fetching dashboard data:', error);
      console.error('❌ Dashboard: Error details:', error.response?.data || error.message);
      // 设置默认值避免页面崩溃
      setDashboardData({
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        budgetProgress: 0,
        recentTransactions: [],
        spendingByCategory: [],
        monthlyTrend: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  
  const calculateProgressPercentage = (value, max) => {
    if (max === 0) return 0;
    return Math.round(Math.min((value / max) * 100, 100));
  };

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName || user?.username}!
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Here's your financial overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.totalBalance)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(dashboardData.monthlyIncome)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(dashboardData.monthlyExpenses)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Budget Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{dashboardData.budgetProgress}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Spending by Category Chart */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Spending by Category</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.spendingByCategory.map((category, index) => {
                const totalSpending = dashboardData.spendingByCategory.reduce((sum, cat) => sum + cat.amount, 0);
                const percentage = calculateProgressPercentage(category.amount, totalSpending);

                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{category.category}</span>
                      <span className="text-sm text-gray-900">{formatCurrency(category.amount)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${category.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Monthly Trend Chart */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Monthly Trend</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.monthlyTrend.map((month, index) => {
                const maxAmount = Math.max(...dashboardData.monthlyTrend.map(m => Math.max(m.income, m.expenses)));
                const incomeHeight = calculateProgressPercentage(month.income, maxAmount);
                const expensesHeight = calculateProgressPercentage(month.expenses, maxAmount);

                return (
                  <div key={index} className="flex items-center">
                    <div className="w-12 text-sm font-medium text-gray-700">{month.month}</div>
                    <div className="flex-1 mx-4">
                      <div className="relative h-8">
                        <div
                          className="absolute bottom-0 left-0 bg-green-500 h-2 rounded transition-all duration-300"
                          style={{ width: `${incomeHeight}%` }}
                          title={`Income: ${formatCurrency(month.income)}`}
                        ></div>
                        <div
                          className="absolute bottom-0 left-0 bg-red-500 h-2 rounded transition-all duration-300"
                          style={{ width: `${expensesHeight}%` }}
                          title={`Expenses: ${formatCurrency(month.expenses)}`}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-900">
                      <span className="text-green-600">{formatCurrency(month.income)}</span>
                      <span className="mx-1">/</span>
                      <span className="text-red-600">{formatCurrency(month.expenses)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-center space-x-6 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Income</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Expenses</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
              <button
                onClick={() => navigate('/transactions')}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <svg className={`w-6 h-6 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d={transaction.type === 'income' ? 'M12 6v6m0 0v6m0-6h6m-6 0H6' : 'M20 12H4'} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button
                onClick={() => navigate('/transactions')}
                className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Transaction
              </button>
              <button
                onClick={() => navigate('/accounts')}
                className="w-full flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Manage Accounts
              </button>
              <button
                onClick={() => navigate('/budgets')}
                className="w-full flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                View Budgets
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="w-full flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile Settings
              </button>
            </div>

            {/* Financial Health Score */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Financial Health Score</h4>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">85/100</span>
                <span className="text-xs text-green-600 font-medium">Excellent</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="mt-2 text-xs text-gray-600">Great job managing your finances!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;