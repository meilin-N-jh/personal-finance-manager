# 个人财务管理器 (Personal Finance Manager)

## 🎯 项目概述

这是一个为Track 1数据库应用开发课程设计的全栈个人财务管理应用。该应用帮助用户跟踪收入支出、管理预算、进行财务数据分析。

### 主要功能
- ✅ 用户注册和登录
- ✅ 交易记录管理
- ✅ 收入支出分类
- ✅ 账户余额管理
- ✅ 预算设置和监控
- ✅ 数据可视化分析

### 技术栈

**后端:**
- Node.js + Express.js
- SQLite 数据库
- JWT 身份认证
- RESTful API 设计

**前端:**
- React 18
- React Router
- Tailwind CSS
- Axios HTTP客户端
- React Context API

## 🚀 快速开始

### 系统要求
- Node.js 16+
- npm 或 yarn

### 安装和运行

1. **克隆项目**
```bash
git clone <your-repo-url>
cd personal-finance-manager
```

2. **安装后端依赖**
```bash
cd server
npm install
```

3. **安装前端依赖**
```bash
cd ../client
npm install
```

4. **初始化数据库**
```bash
cd ../server
node -e "
const { query } = require('./src/database/sqlite-connection');
const fs = require('fs');

// 创建数据库表
const migrationSQL = fs.readFileSync('./migrations/001_create_tables_sqlite.sql', 'utf8');
const statements = migrationSQL.split(';').filter(stmt => stmt.trim());

(async () => {
  try {
    for (const stmt of statements) {
      if (stmt.trim()) await query(stmt.trim());
    }
    console.log('✅ 数据库表创建完成');
  } catch (error) {
    console.error('❌ 数据库创建失败:', error);
  }
})();
"

# 插入测试数据
node src/database/seed-sqlite.js
```

5. **启动服务**
```bash
# 启动后端 (端口3001)
cd server
npm run dev

# 启动前端 (端口3000)
cd ../client
npm start
```

6. **访问应用**
- 前端: http://localhost:3000
- 后端API: http://localhost:3001

## 🔑 测试账户

| 用户名 | 密码 | 描述 |
|--------|------|------|
| testuser | 123456 | 主要测试账户 |
| demo_user | 123456 | 演示账户 |
| student_user | 123456 | 学生账户 |
- **身份验证**: JWT
- **API**: RESTful API

## 功能特性
1. **交易管理**: 记录收入和支出交易
2. **预算管理**: 设置和跟踪各类预算
3. **数据可视化**: 财务数据图表展示
4. **分类管理**: 自定义交易分类
5. **报告生成**: 月度/年度财务报告
6. **用户账户**: 安全的用户注册和登录

## 项目结构
```
personal-finance-manager/
├── server/                 # 后端代码
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── models/        # 数据模型
│   │   ├── routes/        # 路由
│   │   ├── middleware/    # 中间件
│   │   ├── database/      # 数据库配置
│   │   └── utils/         # 工具函数
│   ├── migrations/        # 数据库迁移
│   ├── seeds/            # 测试数据
│   └── package.json
├── client/               # 前端代码
│   ├── src/
│   │   ├── components/   # React组件
│   │   ├── pages/        # 页面组件
│   │   ├── hooks/        # 自定义hooks
│   │   ├── services/     # API服务
│   │   ├── utils/        # 工具函数
│   │   └── styles/       # 样式文件
│   └── package.json
├── docs/                 # 文档
├── reports/              # 项目报告
└── demo/                 # 演示视频
```

## 数据库设计
主要数据表：
- users (用户)
- categories (分类)
- transactions (交易记录)
- budgets (预算)
- accounts (账户)

## 开始使用
1. 克隆仓库
2. 运行 `npm run install-all` 安装依赖
3. 配置数据库连接
4. 运行 `npm run db:migrate` 执行数据库迁移
5. 运行 `npm run dev` 启动开发服务器