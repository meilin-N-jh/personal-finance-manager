-- 示例数据种子文件
-- 插入一些示例的财务数据用于演示

-- 插入示例用户
INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES
('demo_user', 'demo@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VUCSAe2l6', '张', '三'),
-- 密码是: demo123
('student_user', 'student@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VUCSAe2l6', '李', '四');

-- 插入账户类型
INSERT INTO accounts (user_id, name, type, balance, currency) VALUES
(1, '招商银行储蓄卡', 'checking', 8500.00, 'CNY'),
(1, '支付宝余额', 'cash', 320.50, 'CNY'),
(1, '信用卡', 'credit_card', -1250.75, 'CNY'),
(2, '校园卡', 'checking', 1200.00, 'CNY');

-- 插入收入分类
INSERT INTO categories (user_id, name, type, color, icon) VALUES
(1, '工资', 'income', '#10B981', 'briefcase'),
(1, '奖学金', 'income', '#3B82F6', 'award'),
(1, '兼职收入', 'income', '#8B5CF6', 'clock'),
(1, '理财收益', 'income', '#F59E0B', 'trending-up'),
(2, '生活费', 'income', '#10B981', 'wallet'),
(2, '助学金', 'income', '#3B82F6', 'gift');

-- 插入支出分类
INSERT INTO categories (user_id, name, type, color, icon) VALUES
(1, '餐饮', 'expense', '#EF4444', 'coffee'),
(1, '交通', 'expense', '#F59E0B', 'car'),
(1, '购物', 'expense', '#8B5CF6', 'shopping-bag'),
(1, '娱乐', 'expense', '#EC4899', 'gamepad-2'),
(1, '学习', 'expense', '#3B82F6', 'book'),
(1, '生活缴费', 'expense', '#6B7280', 'home'),
(2, '食堂', 'expense', '#EF4444', 'utensils'),
(2, '学习用品', 'expense', '#3B82F6', 'pen-tool'),
(2, '交通费', 'expense', '#F59E0B', 'bus');

-- 插入最近的交易记录（用户1）
INSERT INTO transactions (user_id, account_id, category_id, amount, type, description, date) VALUES
-- 收入记录
(1, 1, 1, 8000.00, 'income', '11月份工资', '2024-11-25'),
(1, 1, 3, 500.00, 'income', '周末兼职收入', '2024-11-23'),
(1, 1, 2, 1000.00, 'income', '学业奖学金', '2024-11-20'),

-- 支出记录
(1, 1, 8, 45.50, 'expense', '午餐和晚餐', '2024-11-28'),
(1, 1, 8, 38.00, 'expense', '和朋友聚餐', '2024-11-27'),
(1, 1, 9, 12.00, 'expense', '地铁月卡充值', '2024-11-26'),
(1, 1, 10, 299.00, 'expense', '买新鞋子', '2024-11-25'),
(1, 1, 11, 89.00, 'expense', '电影票和爆米花', '2024-11-24'),
(1, 1, 12, 156.00, 'expense', '买专业书籍', '2024-11-23'),
(1, 2, 8, 28.50, 'expense', '咖啡和点心', '2024-11-28'),
(1, 2, 8, 15.00, 'expense', '早餐', '2024-11-27'),
(1, 3, 13, 120.75, 'expense', '电费', '2024-11-25'),
(1, 3, 13, 89.00, 'expense', '水费', '2024-11-24'),
(1, 3, 13, 200.00, 'expense', '手机话费', '2024-11-22');

-- 插入最近的交易记录（用户2）
INSERT INTO transactions (user_id, account_id, category_id, amount, type, description, date) VALUES
-- 收入记录
(2, 4, 5, 2000.00, 'income', '12月份生活费', '2024-12-01'),
(2, 4, 6, 500.00, 'income', '助学金', '2024-11-28'),

-- 支出记录
(2, 4, 14, 8.50, 'expense', '食堂午餐', '2024-11-28'),
(2, 4, 14, 12.00, 'expense', '食堂晚餐', '2024-11-28'),
(2, 4, 14, 6.00, 'expense', '食堂早餐', '2024-11-27'),
(2, 4, 15, 45.00, 'expense', '买笔记本和笔', '2024-11-26'),
(2, 4, 16, 20.00, 'expense', '校园巴士月卡', '2024-11-25');

-- 插入预算设置（用户1）
INSERT INTO budgets (user_id, category_id, amount, period, start_date, end_date) VALUES
(1, 8, 1200.00, 'monthly', '2024-12-01', '2024-12-31'),  -- 餐饮预算1200元/月
(1, 9, 200.00, 'monthly', '2024-12-01', '2024-12-31'),   -- 交通预算200元/月
(1, 10, 500.00, 'monthly', '2024-12-01', '2024-12-31'),  -- 购物预算500元/月
(1, 11, 300.00, 'monthly', '2024-12-01', '2024-12-31'),  -- 娱乐预算300元/月
(1, 12, 200.00, 'monthly', '2024-12-01', '2024-12-31');  -- 学习预算200元/月

-- 插入预算设置（用户2）
INSERT INTO budgets (user_id, category_id, amount, period, start_date, end_date) VALUES
(2, 14, 800.00, 'monthly', '2024-12-01', '2024-12-31'),   -- 食堂预算800元/月
(2, 15, 100.00, 'monthly', '2024-12-01', '2024-12-31'),   -- 学习用品预算100元/月
(2, 16, 50.00, 'monthly', '2024-12-01', '2024-12-31');    -- 交通预算50元/月

-- 插入一些循环交易记录
INSERT INTO recurring_transactions (user_id, account_id, category_id, amount, type, description, frequency, next_date, is_active) VALUES
(1, 1, 1, 8000.00, 'income', '月度工资', 'monthly', '2024-12-25', true),
(1, 3, 13, 120.00, 'expense', '电费月付', 'monthly', '2024-12-25', true),
(1, 3, 13, 89.00, 'expense', '水费月付', 'monthly', '2024-12-24', true),
(2, 4, 5, 2000.00, 'income', '月度生活费', 'monthly', '2025-01-01', true);

-- 更新序列，确保新增数据时的ID正确
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('accounts_id_seq', (SELECT MAX(id) FROM accounts));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('transactions_id_seq', (SELECT MAX(id) FROM transactions));
SELECT setval('budgets_id_seq', (SELECT MAX(id) FROM budgets));
SELECT setval('recurring_transactions_id_seq', (SELECT MAX(id) FROM recurring_transactions));