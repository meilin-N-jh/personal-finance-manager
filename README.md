# 个人财务管理器 / Personal Finance Manager

---

## 🇨🇳 中文版本 / Chinese Version

### 🎯 项目概述

这是一个功能完整的全栈个人财务管理应用，专为现代个人财务管理需求设计。该应用提供直观的用户界面，帮助用户轻松跟踪收入支出、管理多个账户、设置和监控预算、进行全面的财务数据分析。

### ✨ 核心功能

**用户管理**
- 🔐 安全的用户注册和登录系统
- 👤 完整的个人资料管理
- 🔒 JWT身份认证保护
- ⚙️ 用户偏好设置

**交易管理**
- 💰 完整的收入支出记录
- 🏷️ 灵活的分类管理系统
- 🔍 高级筛选和搜索功能
- 📊 实时交易统计和分析

**账户管理**
- 💳 多账户类型支持（储蓄、支票、信用卡、现金、投资、贷款）
- 📈 实时余额跟踪
- 💼 账户间转账记录
- 📋 账户详细信息管理
- 🇭🇰 香港本地银行账户支持（中国银行、汇丰银行、恒生银行等）
- 🚌 八达通卡余额管理
- 💰 电子钱包集成（支付宝香港、微信支付香港）

**预算管理**
- 📅 多种预算周期（周、月、季、年）
- 📊 可视化预算进度跟踪（实时支出计算）
- ⚠️ 预算超支提醒
- 🎯 预算目标设定和监控
- 💹 预算使用率分析和报告

**数据分析**
- 📈 支出分类分析图表
- 📊 月度收支趋势分析
- 💯 财务健康评分系统
- 📱 响应式数据可视化

### 🛠️ 技术架构

**后端技术栈**
- Node.js + Express.js - 高性能服务器框架
- PostgreSQL - 可靠的关系型数据库
- JWT - 安全的身份认证机制
- RESTful API - 标准化的API设计
- CORS - 跨域资源共享支持

**前端技术栈**
- React 18 - 现代化的用户界面框架
- React Router - 单页应用路由管理
- Tailwind CSS - 实用优先的CSS框架
- Axios - 高效的HTTP客户端
- React Context API - 全局状态管理
- 响应式设计 - 移动端友好的用户界面

---

## 🇺🇸 English Version

### 🎯 Project Overview

This is a feature-complete full-stack personal finance management application designed for modern personal financial management needs. The application provides an intuitive user interface that helps users easily track income and expenses, manage multiple accounts, set and monitor budgets, and conduct comprehensive financial data analysis.

### ✨ Core Features

**User Management**
- 🔐 Secure user registration and login system
- 👤 Complete profile management
- 🔒 JWT authentication protection
- ⚙️ User preference settings

**Transaction Management**
- 💰 Complete income and expense tracking
- 🏷️ Flexible category management system
- 🔍 Advanced filtering and search functionality
- 📊 Real-time transaction statistics and analysis

**Account Management**
- 💳 Multiple account types support (Savings, Checking, Credit Card, Cash, Investment, Loan)
- 📈 Real-time balance tracking
- 💼 Inter-account transfer records
- 📋 Account detail management
- 🇭🇰 Hong Kong local bank account support (Bank of China, HSBC, Hang Seng Bank, etc.)
- 🚌 Octopus Card balance management
- 💰 E-wallet integration (AlipayHK, WeChat Pay HK)

**Budget Management**
- 📅 Multiple budget periods (Weekly, Monthly, Quarterly, Yearly)
- 📊 Visual budget progress tracking (Real-time spending calculation)
- ⚠️ Budget overspending alerts
- 🎯 Budget goal setting and monitoring
- 💹 Budget utilization analysis and reports

**Data Analytics**
- 📈 Spending category analysis charts
- 📊 Monthly income and expense trend analysis
- 💯 Financial health scoring system
- 📱 Responsive data visualization

### 🛠️ Technical Architecture

**Backend Technology Stack**
- Node.js + Express.js - High-performance server framework
- PostgreSQL - Reliable relational database
- JWT - Secure authentication mechanism
- RESTful API - Standardized API design
- CORS - Cross-origin resource sharing support

**Frontend Technology Stack**
- React 18 - Modern user interface framework
- React Router - Single-page application routing
- Tailwind CSS - Utility-first CSS framework
- Axios - Efficient HTTP client
- React Context API - Global state management
- Responsive Design - Mobile-friendly user interface

---

## 🇨🇳 安装指南 / Installation Guide

### 📋 系统要求 / System Requirements
- Node.js 16+
- PostgreSQL 12+
- npm 或 yarn / npm or yarn

### 🚀 安装和运行 / Installation and Setup

**1. 克隆项目 / Clone Repository**
```bash
git clone https://github.com/meilin-N-jh/personal-finance-manager.git
cd personal-finance-manager
```

**2. 安装后端依赖 / Install Backend Dependencies**
```bash
cd server
npm install
```

**3. 安装前端依赖 / Install Frontend Dependencies**
```bash
cd ../client
npm install
```

**4. 配置数据库 / Database Setup**

*首先安装PostgreSQL (if not already installed):*
```bash
# macOS
brew install postgresql
brew services start postgresql

# 创建数据库
createdb personal_finance_db

# 创建用户 (可选)
createuser -P finance_user
```

*配置环境变量:*
```bash
cd server
cp .env.example .env
# 编辑 .env 文件，配置数据库连接信息
```

**5. 初始化数据库 / Initialize Database**
```bash
cd server

# 运行数据库迁移
npm run db:migrate

# 插入初始数据 / Seed initial data
npm run db:seed
```

**6. 启动服务 / Start Services**
```bash
# 启动后端服务器 (端口3001) / Start backend server (port 3001)
cd server
npm run dev

# 新开终端，启动前端应用 (端口3000) / New terminal, start frontend app (port 3000)
cd ../client
npm start
```

**7. 访问应用 / Access Application**
- 🌐 前端应用 / Frontend: http://localhost:3000
- 🔌 后端API / Backend API: http://localhost:3001

### 🧪 测试账户 / Test Accounts

| 用户名 / Username | 密码 / Password | 描述 / Description |
|------------------|----------------|-------------------|
| cityu boy | 123456 | 香港城市大学学生演示账户 / CityU Student Demo Account |
| testuser | 123456 | 主要测试账户 / Primary test account |
| demo_user | 123456 | 演示账户 / Demo account |

---

## 🏗️ 项目结构 / Project Structure

```
personal-finance-manager/
├── server/                    # 后端代码 / Backend Code
│   ├── src/
│   │   ├── controllers/       # 控制器层 / Controllers
│   │   │   ├── authController.js
│   │   │   ├── transactionController.js
│   │   │   ├── accountController.js
│   │   │   ├── budgetController.js
│   │   │   └── categoryController.js
│   │   ├── models/           # 数据模型 / Data Models
│   │   │   ├── User.js
│   │   │   ├── Transaction.js
│   │   │   ├── Account.js
│   │   │   ├── Budget.js
│   │   │   └── Category.js
│   │   ├── routes/           # 路由定义 / Routes
│   │   │   ├── auth.js
│   │   │   ├── transactions.js
│   │   │   ├── accounts.js
│   │   │   ├── budgets.js
│   │   │   └── categories.js
│   │   ├── middleware/       # 中间件 / Middleware
│   │   │   ├── auth.js
│   │   │   └── validation.js
│   │   ├── database/         # 数据库配置 / Database Config
│   │   │   ├── connection.js
│   │   │   └── migrations.js
│   │   └── utils/            # 工具函数 / Utilities
│   │       ├── jwt.js
│   │       └── helpers.js
│   ├── migrations/           # 数据库迁移 / Database Migrations
│   │   ├── 001_create_tables.sql
│   │   └── 002_add_indexes.sql
│   ├── seeds/               # 测试数据 / Seed Data
│   │   └── seed_data.sql
│   ├── .env                 # 环境变量 / Environment Variables
│   └── package.json
├── client/                  # 前端代码 / Frontend Code
│   ├── public/              # 静态资源 / Static Assets
│   ├── src/
│   │   ├── components/      # 可复用组件 / Reusable Components
│   │   │   ├── Layout/
│   │   │   ├── Navigation/
│   │   │   └── Common/
│   │   ├── pages/           # 页面组件 / Page Components
│   │   │   ├── Dashboard.js
│   │   │   ├── Transactions.js
│   │   │   ├── Accounts.js
│   │   │   ├── Budgets.js
│   │   │   ├── Profile.js
│   │   │   └── Login.js
│   │   ├── services/        # API服务 / API Services
│   │   │   ├── transactionService.js
│   │   │   ├── accountService.js
│   │   │   ├── budgetService.js
│   │   │   └── categoryService.js
│   │   ├── contexts/        # React Context / React Contexts
│   │   │   └── AuthContext.js
│   │   ├── hooks/           # 自定义Hooks / Custom Hooks
│   │   ├── utils/           # 工具函数 / Utility Functions
│   │   └── styles/          # 样式文件 / Style Files
│   └── package.json
├── docs/                    # 项目文档 / Documentation
├── README.md               # 项目说明 / Project README
└── .gitignore              # Git忽略文件 / Git Ignore File
```

---

## 💾 数据库设计 / Database Design

### 📊 主要数据表 / Main Data Tables

**🧑‍💼 users / 用户表**
- 用户基本信息和认证数据
- User basic information and authentication data

**🏷️ categories / 分类表**
- 收入支出分类管理
- Income and expense category management

**💰 transactions / 交易表**
- 所有交易记录的详细信息
- Detailed information for all transaction records

**💳 accounts / 账户表**
- 用户多个账户信息
- User multiple account information

**📊 budgets / 预算表**
- 预算设置和进度跟踪
- Budget settings and progress tracking

### 🔗 表关系 / Table Relationships
- 用户可以拥有多个账户、预算和交易
- Users can have multiple accounts, budgets, and transactions
- 每个交易属于特定账户和分类
- Each transaction belongs to a specific account and category
- 预算按分类设置并与相关交易关联
- Budgets are set by category and linked to related transactions

---

## 🚀 部署说明 / Deployment

### 🔧 开发环境 / Development Environment

**本地开发 / Local Development:**
```bash
# 后端服务器 / Backend Server
cd server && npm run dev

# 前端应用 / Frontend Application
cd client && npm start
```

### 🌟 生产环境 / Production Environment

**环境变量配置 / Environment Variables:**
```bash
# server/.env
NODE_ENV=production
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=personal_finance_db
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-jwt-secret-key
PORT=3001
```

**构建和部署 / Build and Deploy:**
```bash
# 构建前端 / Build Frontend
cd client
npm run build

# 部署后端 / Deploy Backend (使用 PM2)
cd server
pm2 start src/index.js --name "finance-api"
```

---

## 📱 API 文档 / API Documentation

### 🔐 认证 / Authentication
- `POST /api/auth/register` - 用户注册 / User Registration
- `POST /api/auth/login` - 用户登录 / User Login
- `GET /api/auth/profile` - 获取用户信息 / Get User Profile

### 💰 交易管理 / Transaction Management
- `GET /api/transactions` - 获取交易列表 / Get Transactions
- `POST /api/transactions` - 创建交易 / Create Transaction
- `PUT /api/transactions/:id` - 更新交易 / Update Transaction
- `DELETE /api/transactions/:id` - 删除交易 / Delete Transaction

### 💳 账户管理 / Account Management
- `GET /api/accounts` - 获取账户列表 / Get Accounts
- `POST /api/accounts` - 创建账户 / Create Account
- `PUT /api/accounts/:id` - 更新账户 / Update Account
- `DELETE /api/accounts/:id` - 删除账户 / Delete Account

### 📊 预算管理 / Budget Management
- `GET /api/budgets` - 获取预算列表 / Get Budgets
- `POST /api/budgets` - 创建预算 / Create Budget
- `PUT /api/budgets/:id` - 更新预算 / Update Budget
- `DELETE /api/budgets/:id` - 删除预算 / Delete Budget

---

## 👥 团队协作 / Team Collaboration

### 🔄 如何与团队成员共享项目 / How to Share Project with Team Members

**重要说明 / Important Notice:**
直接下载项目压缩包**不包含**数据库内容。数据库数据需要单独设置。

Downloading the project ZIP directly **does NOT include** database data. Database setup is required separately.

### 📦 团队成员设置指南 / Team Member Setup Guide

**步骤 1: 获取项目代码 / Step 1: Get Project Code**
```bash
# 选项 A: 从 GitHub 克隆 (推荐) / Option A: Clone from GitHub (Recommended)
git clone https://github.com/meilin-N-jh/personal-finance-manager.git
cd personal-finance-manager

# 选项 B: 下载并解压项目文件 / Option B: Download and extract project files
# 然后进入项目目录 / Then navigate to project directory
```

**步骤 2: 安装依赖 / Step 2: Install Dependencies**
```bash
# 后端依赖 / Backend dependencies
cd server
npm install

# 前端依赖 / Frontend dependencies
cd ../client
npm install
```

**步骤 3: 设置本地数据库 / Step 3: Setup Local Database**
```bash
# 安装 PostgreSQL (如果尚未安装) / Install PostgreSQL (if not already installed)
# macOS: / macOS:
brew install postgresql
brew services start postgresql

# Ubuntu: / Ubuntu:
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# 创建数据库 / Create database
createdb personal_finance_db

# 创建用户 (可选，推荐用于开发) / Create user (optional, recommended for development)
createuser -P finance_user
# 按提示设置密码，例如: 123456 / Set password when prompted, e.g.: 123456
```

**步骤 4: 配置环境变量 / Step 4: Configure Environment Variables**
```bash
cd server
cp .env.example .env
# 编辑 .env 文件，设置数据库连接信息 / Edit .env file to set database connection info
```

**步骤 5: 初始化数据库结构 / Step 5: Initialize Database Structure**
```bash
cd server
# 运行数据库迁移 / Run database migrations
npm run db:migrate

# 插入基础分类数据 / Insert basic category data
npm run db:seed

# 添加演示数据 (可选) / Add demo data (optional)
node scripts/add-demo-budget-data.js
```

**步骤 6: 启动应用 / Step 6: Start Application**
```bash
# 启动后端服务器 / Start backend server
cd server
npm run dev

# 新开终端，启动前端应用 / Open new terminal, start frontend app
cd ../client
npm start
```

### 📊 数据库数据共享 / Database Data Sharing

如果你需要共享实际的数据库数据，有几种方法：

**方法 1: 数据库转储文件 (推荐) / Method 1: Database Dump File (Recommended)**
```bash
# 导出数据库 / Export database
pg_dump personal_finance_db > database_backup.sql

# 团队成员导入数据库 / Team member imports database
psql personal_finance_db < database_backup.sql
```

**方法 2: 使用演示数据脚本 / Method 2: Use Demo Data Script**
```bash
# 运行演示数据脚本 / Run demo data script
node scripts/add-demo-budget-data.js
```


## 🤝 贡献指南 / Contributing

1. Fork 项目 / Fork the Project
2. 创建功能分支 / Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. 提交更改 / Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 / Push to the Branch (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request / Create a Pull Request

---

<<<<<<< HEAD
=======

---
>>>>>>> b556e35 (完善财务管理器功能和用户体验)

## 👨‍💻 作者 / Author

**GitHub:** [@meilin-N-jh](https://github.com/meilin-N-jh)

**项目链接 / Project Link:** [https://github.com/meilin-N-jh/personal-finance-manager](https://github.com/meilin-N-jh/personal-finance-manager)

