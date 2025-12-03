import React, { useState } from 'react';

const NetworkTest = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(`${new Date().toLocaleTimeString()}: ${message}`);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  // 测试基本网络连接
  const testBasicConnection = async () => {
    addLog('=== 开始基本连接测试 ===');
    try {
      const response = await fetch('http://localhost:3001/health');
      addLog(`健康检查状态: ${response.status}`);
      const data = await response.json();
      addLog(`健康检查响应: ${JSON.stringify(data)}`);
    } catch (error) {
      addLog(`❌ 健康检查失败: ${error.message}`);
    }
  };

  // 测试预检请求
  const testPreflightRequest = async () => {
    addLog('=== 开始预检请求测试 ===');
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      addLog(`预检请求状态: ${response.status}`);
      addLog(`预检请求头: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);
    } catch (error) {
      addLog(`❌ 预检请求失败: ${error.message}`);
    }
  };

  // 测试原生登录请求
  const testRawLogin = async () => {
    addLog('=== 开始原生登录测试 ===');
    setLoading(true);

    try {
      addLog('发送POST请求到 http://localhost:3001/api/auth/login');

      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: 'testuser',
          password: '123456'
        })
      });

      addLog(`✅ 请求完成，状态码: ${response.status} ${response.statusText}`);
      addLog(`响应头: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);

      if (response.ok) {
        const data = await response.json();
        addLog(`🎉 登录成功! 数据: ${JSON.stringify(data)}`);
      } else {
        const errorText = await response.text();
        addLog(`❌ 登录失败: ${errorText}`);
      }
    } catch (error) {
      addLog(`❌ 网络错误: ${error.message}`);
      addLog(`错误类型: ${error.name}`);
      addLog(`错误堆栈: ${error.stack || '无堆栈信息'}`);

      // 额外的错误诊断
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        addLog('🔍 这可能是一个CORS或网络连接问题');
      }
      if (error.message.includes('NetworkError')) {
        addLog('🔍 网络连接被拒绝，请检查服务器是否运行');
      }
    } finally {
      setLoading(false);
    }
  };

  // 测试浏览器环境
  const testBrowserEnvironment = () => {
    addLog('=== 浏览器环境信息 ===');
    addLog(`当前URL: ${window.location.href}`);
    addLog(`协议: ${window.location.protocol}`);
    addLog(`主机: ${window.location.host}`);
    addLog(`用户代理: ${navigator.userAgent}`);

    // 检查localStorage
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      addLog('✅ localStorage 正常工作');
    } catch (error) {
      addLog(`❌ localStorage 错误: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔧 深度网络诊断工具</h1>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={testBrowserEnvironment} style={buttonStyle}>
          🌍 测试浏览器环境
        </button>
        <button onClick={testBasicConnection} style={buttonStyle}>
          🏥 健康检查
        </button>
        <button onClick={testPreflightRequest} style={buttonStyle}>
          🛫 预检请求测试
        </button>
        <button onClick={testRawLogin} disabled={loading} style={buttonStyle}>
          {loading ? '🔄 测试中...' : '🔐 原生登录测试'}
        </button>
        <button onClick={clearLogs} style={{...buttonStyle, backgroundColor: '#e74c3c'}}>
          🗑️ 清除日志
        </button>
      </div>

      <div style={{
        backgroundColor: '#2c3e50',
        color: '#ecf0f1',
        padding: '20px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '12px',
        maxHeight: '500px',
        overflow: 'auto',
        whiteSpace: 'pre-wrap'
      }}>
        <h3>📋 诊断日志:</h3>
        {logs.length === 0 ? (
          <p>点击按钮开始诊断...</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={{ marginBottom: '4px' }}>
              {log}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#ecf0f1', borderRadius: '8px' }}>
        <h3>🎯 测试建议:</h3>
        <ol>
          <li>首先测试浏览器环境</li>
          <li>然后进行健康检查</li>
          <li>测试预检请求</li>
          <li>最后进行原生登录测试</li>
        </ol>
        <p><strong>如果所有测试都通过，说明网络连接正常，问题可能在React组件中。</strong></p>
      </div>
    </div>
  );
};

const buttonStyle = {
  margin: '5px',
  padding: '10px 15px',
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px'
};

export default NetworkTest;