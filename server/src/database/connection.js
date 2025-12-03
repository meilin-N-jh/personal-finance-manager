require('dotenv').config();

// 根据环境变量选择数据库类型
const dbType = process.env.DB_TYPE || 'sqlite';

let db;

if (dbType === 'postgres') {
  const { Pool } = require('pg');

  // PostgreSQL连接配置
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'finance_manager',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
  });

  pool.on('error', (err) => {
    console.error('Database connection error:', err);
  });

  db = {
    query: (text, params) => pool.query(text, params),
    pool
  };
} else {
  // 使用SQLite（默认）
  console.log('Using SQLite database');
  db = require('./sqlite-connection');
}

// Initialize database function
const initializeDatabase = async () => {
  // Database initialization logic if needed
  console.log(`${dbType === 'postgres' ? 'PostgreSQL' : 'SQLite'} database initialized`);
};

module.exports = {
  ...db,
  initializeDatabase
};