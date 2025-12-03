import React, { useState } from 'react';

const ConnectionTest = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, status, message) => {
    const timestamp = new Date().toLocaleTimeString();
    setResults(prev => [...prev, { test, status, message, timestamp }]);
    console.log(`[${timestamp}] ${test}: ${message} (${status})`);
  };

  const clearResults = () => {
    setResults([]);
  };

  const runTests = async () => {
    setLoading(true);
    setResults([]);

    // Test 1: Health Check
    addResult('健康检查', 'info', '测试后端健康检查...');
    try {
      const response = await fetch('http://localhost:8001/health');
      if (response.ok) {
        const data = await response.json();
        addResult('健康检查', 'success', `✅ 成功 - 运行时间: ${data.uptime.toFixed(1)}秒`);
      } else {
        addResult('健康检查', 'error', `❌ 失败 - 状态码: ${response.status}`);
      }
    } catch (error) {
      addResult('健康检查', 'error', `❌ 网络错误: ${error.message}`);
    }

    // Test 2: Login Test
    addResult('登录测试', 'info', '测试用户登录...');
    try {
      const response = await fetch('http://localhost:8001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: 'testuser',
          password: '123456'
        })
      });

      if (response.ok) {
        const data = await response.json();
        addResult('登录测试', 'success', `✅ 登录成功 - 用户: ${data.user.firstName} ${data.user.lastName}`);
      } else {
        const errorText = await response.text();
        addResult('登录测试', 'error', `❌ 登录失败: ${errorText}`);
      }
    } catch (error) {
      addResult('登录测试', 'error', `❌ 网络错误: ${error.message}`);
    }

    setLoading(false);
  };

  const testDirectLogin = async () => {
    addResult('直接登录测试', 'info', '使用AuthContext直接测试登录...');

    try {
      // 这里我们模拟登录组件的行为
      const response = await fetch('http://localhost:8001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser',
          password: '123456'
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        addResult('直接登录测试', 'success', `✅ 完全成功 - Token已保存到localStorage`);
      } else {
        addResult('直接登录测试', 'error', `❌ 登录失败`);
      }
    } catch (error) {
      addResult('直接登录测试', 'error', `❌ 错误: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔗 连接测试</h1>
      <p>测试前端到后端的连接</p>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={runTests}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#95a5a6' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginRight: '10px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔄 测试中...' : '🧪 运行连接测试'}
        </button>

        <button
          onClick={testDirectLogin}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          🔐 直接登录测试
        </button>

        <button
          onClick={clearResults}
          style={{
            padding: '10px 20px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🗑️ 清除结果
        </button>
      </div>

      {results.length > 0 && (
        <div>
          <h2>📊 测试结果</h2>
          <div style={{
            backgroundColor: '#2c3e50',
            color: '#ecf0f1',
            padding: '15px',
            borderRadius: '8px',
            maxHeight: '300px',
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '13px'
          }}>
            {results.map((result, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '8px',
                  padding: '8px',
                  backgroundColor: result.status === 'success' ? '#27ae6030' :
                                   result.status === 'error' ? '#e74c3c30' :
                                   result.status === 'info' ? '#3498db30' : '#95a5a630',
                  borderRadius: '4px',
                  borderLeft: `4px solid ${
                    result.status === 'success' ? '#27ae60' :
                    result.status === 'error' ? '#e74c3c' :
                    result.status === 'info' ? '#3498db' : '#95a5a6'
                  }`
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                  [{result.timestamp}] {result.test}
                </div>
                <div>{result.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#ecf0f1',
        borderRadius: '8px'
      }}>
        <h3>📋 测试账户</h3>
        <p><strong>用户名:</strong> testuser</p>
        <p><strong>密码:</strong> 123456</p>

        <h3>🔗 服务地址</h3>
        <p><strong>前端:</strong> http://localhost:3000</p>
        <p><strong>后端:</strong> http://localhost:8001</p>

        <h3>📝 使用说明</h3>
        <ol>
          <li>点击"运行连接测试"检查基本连接</li>
          <li>点击"直接登录测试"模拟用户登录</li>
          <li>如果测试成功，返回首页尝试登录</li>
        </ol>
      </div>
    </div>
  );
};

export default ConnectionTest;