import React, { useState } from 'react';

const ProxyTest = () => {
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

  // 创建代理fetch函数
  const proxyFetch = async (url, options = {}) => {
    // 如果是API请求，通过我们的代理
    if (url.startsWith('http://localhost:8001')) {
      // 使用服务器端代理的方案
      const proxyUrl = url.replace('http://localhost:8001', '/api-proxy');
      return fetch(proxyUrl, options);
    }
    return fetch(url, options);
  };

  const testProxyConnection = async () => {
    setLoading(true);
    setResults([]);

    // 方法1: 直接尝试连接（现在的CORS应该工作）
    addResult('直接连接测试', 'info', '尝试直接连接到后端...');
    try {
      const response = await fetch('http://localhost:8001/health');
      if (response.ok) {
        const data = await response.json();
        addResult('直接连接测试', 'success', `✅ 直接连接成功！运行时间: ${data.uptime.toFixed(1)}秒`);
      } else {
        addResult('直接连接测试', 'warning', `⚠️ 直接连接失败: ${response.status}`);
      }
    } catch (error) {
      addResult('直接连接测试', 'error', `❌ 直接连接错误: ${error.message}`);

      // 如果直接连接失败，尝试其他方法
      await tryAlternativeMethods();
    }

    setLoading(false);
  };

  const tryAlternativeMethods = async () => {
    // 方法2: 尝试不同的地址格式
    addResult('地址格式测试', 'info', '尝试使用127.0.0.1地址...');
    try {
      const response = await fetch('http://127.0.0.1:8001/health');
      if (response.ok) {
        addResult('地址格式测试', 'success', `✅ 127.0.0.1地址工作！`);
      } else {
        addResult('地址格式测试', 'warning', `⚠️ 127.0.0.1也失败`);
      }
    } catch (error) {
      addResult('地址格式测试', 'error', `❌ 127.0.0.1失败: ${error.message}`);
    }

    // 方法3: 测试浏览器网络状态
    addResult('浏览器网络状态', 'info', '检查浏览器网络...');
    const isOnline = navigator.onLine;
    addResult('浏览器网络状态', isOnline ? 'success' : 'error',
      isOnline ? '✅ 浏览器在线' : '❌ 浏览器离线');

    // 方法4: 检查是否有扩展阻止
    addResult('安全检查', 'info', '检查可能的安全问题...');

    if (window.location.protocol === 'https:' && !window.location.hostname.includes('localhost')) {
      addResult('安全检查', 'error', '❌ 混合内容问题 - HTTPS页面访问HTTP API');
      addResult('安全检查', 'info', '💡 尝试访问 http://localhost:3000 (而不是https)');
    } else {
      addResult('安全检查', 'success', '✅ 协议检查通过');
    }

    // 方法5: 创建简单的本地测试API
    addResult('本地API模拟', 'info', '创建本地模拟数据...');
    const mockLoginResponse = {
      message: "Login successful",
      user: {
        id: 3,
        username: "testuser",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User"
      },
      token: "mock-jwt-token-for-testing"
    };

    localStorage.setItem('token', mockLoginResponse.token);
    localStorage.setItem('user', JSON.stringify(mockLoginResponse.user));

    addResult('本地API模拟', 'success', `✅ 模拟登录数据已保存到localStorage`);
    addResult('本地API模拟', 'info', `💡 现在可以尝试访问 /dashboard 路由`);
  };

  const testLocalstorageAuth = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      const user = JSON.parse(userStr);
      addResult('本地认证检查', 'success', `✅ 找到本地认证数据`);
      addResult('本地认证检查', 'info', `用户: ${user.firstName} ${user.lastName}`);
      addResult('本地认证检查', 'info', `Token: ${token.substring(0, 20)}...`);
    } else {
      addResult('本地认证检查', 'error', `❌ 没有找到本地认证数据`);
    }
  };

  const clearLocalAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    addResult('清理认证数据', 'info', `🗑️ 本地认证数据已清理`);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔧 网络连接修复测试</h1>
      <p>如果你的浏览器无法连接到后端，这个页面可以帮助诊断和解决</p>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={testProxyConnection}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#95a5a6' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            marginRight: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          {loading ? '🔄 测试中...' : '🔗 测试连接修复方案'}
        </button>

        <button
          onClick={testLocalstorageAuth}
          style={{
            padding: '12px 24px',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            marginRight: '10px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔐 检查本地认证
        </button>

        <button
          onClick={clearLocalAuth}
          style={{
            padding: '12px 24px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            marginRight: '10px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🗑️ 清理认证数据
        </button>

        <button
          onClick={clearResults}
          style={{
            padding: '12px 24px',
            backgroundColor: '#7f8c8d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📋 清除日志
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
            maxHeight: '400px',
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '1.4'
          }}>
            {results.map((result, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '8px',
                  padding: '8px',
                  backgroundColor: result.status === 'success' ? '#27ae6030' :
                                   result.status === 'error' ? '#e74c3c30' :
                                   result.status === 'warning' ? '#f39c1230' :
                                   result.status === 'info' ? '#3498db30' : '#95a5a630',
                  borderRadius: '4px',
                  borderLeft: `4px solid ${
                    result.status === 'success' ? '#27ae60' :
                    result.status === 'error' ? '#e74c3c' :
                    result.status === 'warning' ? '#f39c12' :
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
        <h3>🚀 故障排除指南</h3>

        <h4>如果直接连接失败：</h4>
        <ul>
          <li>尝试使用无痕/隐私模式</li>
          <li>禁用浏览器扩展（特别是广告拦截器）</li>
          <li>清除浏览器缓存</li>
          <li>检查防火墙设置</li>
          <li>尝试使用127.0.0.1:3000而不是localhost:3000</li>
        </ul>

        <h4>如果所有网络测试都失败：</h4>
        <ul>
          <li>使用"模拟登录数据"功能绕过网络问题</li>
          <li>这将保存认证信息到localStorage</li>
          <li>然后可以正常访问应用的其他功能</li>
        </ul>

        <h4>测试账户：</h4>
        <p><strong>用户名:</strong> testuser | <strong>密码:</strong> 123456</p>

        <h4>服务地址：</h4>
        <p><strong>前端:</strong> http://localhost:3000</p>
        <p><strong>后端:</strong> http://localhost:8001</p>
      </div>
    </div>
  );
};

export default ProxyTest;