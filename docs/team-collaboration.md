# 团队协作文档 / Team Collaboration Guide

## 🎯 项目概述 / Project Overview

个人财务管理器是一个全栈Web应用，帮助用户管理个人财务、跟踪交易、设置预算等。

Personal Finance Manager is a full-stack web application that helps users manage personal finances, track transactions, set budgets, and more.

## 📋 团队成员快速上手指南 / Team Member Quick Start Guide

### 🔧 环境准备 / Environment Setup

#### 系统要求 / System Requirements
- Node.js 16+
- PostgreSQL 12+
- npm 或 yarn / npm or yarn
- Git

#### 快速部署步骤 / Quick Deployment Steps

**1. 获取项目代码 / Get Project Code**
```bash
# 从GitHub克隆 / Clone from GitHub
git clone https://github.com/meilin-N-jh/personal-finance-manager.git
cd personal-finance-manager
```

**2. 数据库设置 / Database Setup**
```bash
# 安装PostgreSQL / Install PostgreSQL
# macOS: / macOS:
brew install postgresql
brew services start postgresql

# Ubuntu: / Ubuntu:
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# 创建数据库 / Create database
createdb finance_manager

# (可选) 创建专用用户 / (Optional) Create dedicated user
createuser -P finance_user
```

**3. 环境配置 / Environment Configuration**
```bash
# 复制环境变量模板 / Copy environment template
cd server
cp .env.example .env

# 编辑 .env 文件 / Edit .env file
# 设置数据库连接信息 / Set database connection info
```

**4. 安装依赖 / Install Dependencies**
```bash
# 后端依赖 / Backend dependencies
cd server
npm install

# 前端依赖 / Frontend dependencies
cd ../client
npm install
```

**5. 数据库初始化 / Database Initialization**
```bash
cd server

# 运行迁移 / Run migrations
npm run db:migrate

# 插入基础数据 / Insert base data
npm run db:seed

# 添加演示数据 / Add demo data
node scripts/add-demo-budget-data.js
```

**6. 启动应用 / Start Application**
```bash
# 启动后端服务器 / Start backend server (port 3001)
cd server
npm run dev

# 新开终端启动前端 / Open new terminal for frontend
cd ../client
npm start
```

**7. 访问应用 / Access Application**
- 前端 / Frontend: http://localhost:3000
- 后端API / Backend API: http://localhost:3001

### 🧪 测试账户 / Test Accounts

| 用户名 / Username | 密码 / Password | 描述 / Description |
|------------------|----------------|-------------------|
| cityu boy | 123456 | 演示账户 / Demo Account |
| testuser | 123456 | 测试账户 / Test Account |

## 📊 数据库数据共享 / Database Data Sharing

### 方法 1: 使用数据库备份文件 / Method 1: Use Database Backup File

**项目包含以下数据库文件 / Project includes database files:**
- `database_backup.sql` - 完整数据库备份 / Complete database backup
- `server/migrations/` - 数据库迁移文件 / Database migration files
- `server/seeds/` - 基础数据文件 / Base data files

**导入数据库 / Import Database:**
```bash
# 创建数据库 / Create database
createdb finance_manager

# 导入数据 / Import data
psql finance_manager < database_backup.sql
```

### 方法 2: 使用演示数据脚本 / Method 2: Use Demo Data Script

```bash
cd server
node scripts/add-demo-budget-data.js
```

## 🛠️ 开发工作流程 / Development Workflow

### 代码规范 / Code Standards

**前端 / Frontend:**
- 使用React Hooks / Use React Hooks
- 函数式组件 / Functional components
- Tailwind CSS样式 / Tailwind CSS styling
- ESLint + Prettier格式化 / ESLint + Prettier formatting

**后端 / Backend:**
- RESTful API设计 / RESTful API design
- 中间件模式 / Middleware pattern
- 错误处理 / Error handling
- 输入验证 / Input validation

### Git工作流 / Git Workflow

```bash
# 1. 创建功能分支 / Create feature branch
git checkout -b feature/your-feature-name

# 2. 提交更改 / Commit changes
git add .
git commit -m "feat: add your feature description"

# 3. 推送分支 / Push branch
git push origin feature/your-feature-name

# 4. 创建Pull Request / Create Pull Request
```

### 分支命名规范 / Branch Naming Convention
- `feature/功能名称` - 新功能开发 / New feature development
- `fix/问题描述` - Bug修复 / Bug fix
- `docs/文档更新` - 文档更新 / Documentation update
- `refactor/重构内容` - 代码重构 / Code refactoring

## 🔍 常见问题解决 / Common Issues & Solutions

### 端口冲突 / Port Conflicts
```bash
# 查看端口占用 / Check port usage
lsof -i :3001
lsof -i :3000

# 修改端口 / Change ports
# 编辑 server/src/index.js 修改PORT变量
```

### 数据库连接问题 / Database Connection Issues
1. 检查PostgreSQL是否运行 / Check if PostgreSQL is running
2. 验证.env文件配置 / Verify .env file configuration
3. 确认数据库存在 / Confirm database exists
4. 检查用户权限 / Check user permissions

### 依赖安装问题 / Dependency Installation Issues
```bash
# 清理npm缓存 / Clear npm cache
npm cache clean --force

# 删除node_modules重新安装 / Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📁 项目结构说明 / Project Structure

```
personal-finance-manager/
├── server/                    # 后端代码 / Backend
│   ├── src/
│   │   ├── controllers/       # 控制器
│   │   ├── routes/           # 路由
│   │   ├── middleware/       # 中间件
│   │   ├── database/         # 数据库
│   │   └── utils/            # 工具函数
│   ├── scripts/              # 脚本文件
│   ├── migrations/           # 数据库迁移
│   └── seeds/               # 种子数据
├── client/                   # 前端代码 / Frontend
│   ├── src/
│   │   ├── components/      # 组件
│   │   ├── pages/           # 页面
│   │   ├── services/        # API服务
│   │   ├── contexts/        # Context
│   │   └── utils/           # 工具函数
├── docs/                    # 文档 / Documentation
├── database_backup.sql      # 数据库备份 / Database backup
└── README.md               # 项目说明 / Project README
```

## 📞 技术支持 / Technical Support

**文档资源 / Documentation Resources:**
- [README.md](../README.md) - 项目总览 / Project overview
- [database-schema.md](./database-schema.md) - 数据库设计 / Database design
- [API文档](../README.md#-api-文档-api-documentation) - API接口 / API documentation

**开发工具推荐 / Recommended Development Tools:**
- VS Code + 以下插件 / VS Code + following extensions:
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint
  - GitLens
  - PostgreSQL

## 🔄 持续集成 / Continuous Integration

项目配置了基础的代码质量检查：
The project is configured with basic code quality checks:

- ESLint配置用于代码规范检查
- Prettier用于代码格式化
- 数据库迁移确保数据库结构一致性

## 📝 开发日志 / Development Log

建议在开发过程中记录重要的决策和变更：
It's recommended to document important decisions and changes during development:

- 新功能实现思路 / New feature implementation ideas
- 遇到的技术难题及解决方案 / Technical challenges and solutions
- API变更记录 / API change logs
- 数据库结构变更 / Database schema changes