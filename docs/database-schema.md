# 数据库设计文档 / Database Design Documentation

## 📋 概述 / Overview

个人财务管理器使用PostgreSQL作为后端数据库，采用关系型数据库设计，确保数据一致性和完整性。

Personal Finance Manager uses PostgreSQL as the backend database with relational database design to ensure data consistency and integrity.

**实际数据库名称 / Actual Database Name:** `finance_manager`

## 🗄️ 数据库模式设计 / Database Schema Design

### 1. users (用户表 / User Table)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. accounts (账户表)
```sql
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('checking', 'savings', 'credit_card', 'cash', 'investment')),
    balance DECIMAL(15,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'HKD', -- 支持多货币，默认港币 / Multi-currency support, default HKD
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. categories (分类表)
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    color VARCHAR(7) DEFAULT '#000000',
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. transactions (交易记录表)
```sql
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    amount DECIMAL(15,2) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. budgets (预算表)
```sql
CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    period VARCHAR(20) NOT NULL CHECK (period IN ('monthly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. recurring_transactions (循环交易表)
```sql
CREATE TABLE recurring_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    amount DECIMAL(15,2) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    description TEXT NOT NULL,
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
    next_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 索引设计
```sql
-- 用户查询优化
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_budgets_user_period ON budgets(user_id, period);
CREATE INDEX idx_accounts_user ON accounts(user_id);
```

## 数据关系
- 一个用户可以有多个账户
- 一个用户可以有自定义分类
- 每笔交易属于一个用户、账户和分类
- 预算按用户、分类和时间段设置
- 循环交易用于自动化重复的收入和支出记录

## 数据完整性
- 外键约束确保数据一致性
- CHECK约束限制字段值范围
- 用户隔离确保数据安全

---

## 🛠️ 数据库管理 / Database Management

### 数据库文件位置 / Database Files Location

**项目包含的数据库文件 / Database Files Included in Project:**
- `database_backup.sql` - 完整数据库备份文件 / Complete database backup
- `server/migrations/` - 数据库迁移脚本 / Database migration scripts
- `server/seeds/` - 基础数据脚本 / Base data scripts
- `server/scripts/add-demo-budget-data.js` - 演示数据生成脚本 / Demo data generation script

### 快速数据库设置 / Quick Database Setup

**方法 1: 使用备份文件 / Method 1: Use Backup File**
```bash
# 创建数据库 / Create database
createdb finance_manager

# 导入完整数据 / Import complete data
psql finance_manager < database_backup.sql
```

**方法 2: 使用迁移和种子数据 / Method 2: Use Migrations and Seed Data**
```bash
cd server

# 运行数据库迁移 / Run database migrations
npm run db:migrate

# 插入基础分类数据 / Insert base category data
npm run db:seed

# 添加演示预算数据 / Add demo budget data
node scripts/add-demo-budget-data.js
```

### 演示数据说明 / Demo Data Description

项目包含完整的演示数据，包括：

**用户账户 / User Accounts:**
- `cityu boy` (密码: 123456) - 主要演示账户 / Main demo account
- `testuser` (密码: 123456) - 测试账户 / Test account

**预算数据 / Budget Data:**
- 食品餐饮预算 / Food & Dining Budget
- 交通预算 / Transportation Budget
- 购物预算 / Shopping Budget
- 娱乐预算 / Entertainment Budget
- 公共事业预算 / Utilities Budget

**交易数据 / Transaction Data:**
- 包含各种消费场景的交易记录 / Transaction records for various spending scenarios
- 香港本地化消费数据 / Hong Kong localized spending data
- 收入记录 / Income records

### 数据库维护 / Database Maintenance

**备份命令 / Backup Commands:**
```bash
# 完整备份 / Full backup
pg_dump finance_manager > finance_manager_backup.sql

# 仅数据备份 / Data only backup
pg_dump -a finance_manager > finance_manager_data.sql

# 仅结构备份 / Schema only backup
pg_dump -s finance_manager > finance_manager_schema.sql
```

**还原命令 / Restore Commands:**
```bash
# 还原完整数据库 / Restore complete database
psql finance_manager < finance_manager_backup.sql

# 重建数据库 / Rebuild database
dropdb finance_manager
createdb finance_manager
psql finance_manager < finance_manager_backup.sql
```

### 常见查询示例 / Common Query Examples

**获取用户预算汇总 / Get User Budget Summary:**
```sql
SELECT
  SUM(b.amount) as total_budgeted,
  COALESCE(SUM(t.amount), 0) as total_spent,
  SUM(b.amount) - COALESCE(SUM(t.amount), 0) as remaining
FROM budgets b
LEFT JOIN transactions t ON b.category_id = t.category_id
  AND t.user_id = b.user_id
  AND t.type = 'expense'
WHERE b.user_id = [user_id];
```

**获取分类支出统计 / Get Category Spending Stats:**
```sql
SELECT
  c.name as category_name,
  SUM(t.amount) as total_spent,
  COUNT(t.id) as transaction_count
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.user_id = [user_id] AND t.type = 'expense'
GROUP BY c.name
ORDER BY total_spent DESC;
```

### 性能优化建议 / Performance Optimization Tips

1. **索引使用 / Index Usage:**
   - 已为常用查询字段创建索引 / Indexes created for frequently queried fields
   - 定期分析查询性能 / Regularly analyze query performance

2. **数据清理 / Data Cleanup:**
   - 定期清理过期数据 / Regularly clean up expired data
   - 归档历史交易数据 / Archive historical transaction data

3. **连接池配置 / Connection Pool Configuration:**
   - 应用已配置连接池 / Application configured with connection pool
   - 根据并发需求调整池大小 / Adjust pool size based on concurrency needs