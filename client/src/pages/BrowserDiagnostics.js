import React, { useState } from 'react';

const BrowserDiagnostics = () => {
  const [diagnosticResults, setDiagnosticResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test, status, message, details = null) => {
    const result = {
      test,
      status, // 'success', 'warning', 'error', 'info'
      message,
      details,
      timestamp: new Date().toLocaleTimeString()
    };
    setDiagnosticResults(prev => [...prev, result]);
    console.log(`[${status.toUpperCase()}] ${test}: ${message}`, details || '');
  };

  const clearResults = () => {
    setDiagnosticResults([]);
  };

  const runFullDiagnostic = async () => {
    setIsRunning(true);
    setDiagnosticResults([]);

    addResult('诊断开始', 'info', '开始完整的浏览器网络诊断...');

    // 1. 浏览器环境检查
    addResult('浏览器环境', 'info', `当前URL: ${window.location.href}`);
    addResult('浏览器环境', 'info', `用户代理: ${navigator.userAgent}`);

    // 2. 网络状态检查
    if ('navigator' in window && 'onLine' in navigator) {
      addResult('网络状态', navigator.onLine ? 'success' : 'error',
        navigator.onLine ? '浏览器在线' : '浏览器离线');
    }

    // 3. CORS 预检测试
    addResult('CORS预检', 'info', '开始CORS预检请求测试...');
    try {
      const preflightResponse = await fetch('http://localhost:8001/api/auth/login', {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });

      addResult('CORS预检', 'success',
        `预检请求成功: ${preflightResponse.status}`,
        {
          headers: Object.fromEntries(preflightResponse.headers.entries())
        });
    } catch (error) {
      addResult('CORS预检', 'error',
        `预检请求失败: ${error.message}`,
        {
          name: error.name,
          stack: error.stack
        });
    }

    // 4. 测试后端健康检查
    addResult('后端健康检查', 'info', '测试后端健康检查端点...');
    try {
      const healthResponse = await fetch('http://localhost:8001/health', {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
      });

      const healthData = await healthResponse.json();
      addResult('后端健康检查', 'success',
        `后端健康检查通过: ${healthResponse.status}`,
        {
          data: healthData,
          headers: Object.fromEntries(healthResponse.headers.entries())
        });
    } catch (error) {
      addResult('后端健康检查', 'error',
        `后端健康检查失败: ${error.message}`,
        {
          name: error.name,
          stack: error.stack
        });
    }

    // 5. 测试登录端点 - 使用不同的方法
    addResult('登录测试', 'info', '测试登录端点...');

    // 方法1: 使用fetch
    try {
      const loginResponse = await fetch('http://localhost:8001/api/auth/login', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify({
          username: 'testuser',
          password: '123456'
        })
      });

      addResult('登录测试-Fetch', 'info',
        `登录请求完成: ${loginResponse.status} ${loginResponse.statusText}`);

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        addResult('登录测试-Fetch', 'success',
          '登录成功！',
          {
            userData: loginData.user,
            hasToken: !!loginData.token
          });
      } else {
        const errorText = await loginResponse.text();
        addResult('登录测试-Fetch', 'warning',
          `登录失败: ${errorText}`,
          {
            status: loginResponse.status,
            statusText: loginResponse.statusText,
            headers: Object.fromEntries(loginResponse.headers.entries())
          });
      }
    } catch (fetchError) {
      addResult('登录测试-Fetch', 'error',
        `Fetch登录失败: ${fetchError.message}`,
        {
          name: fetchError.name,
          stack: fetchError.stack,
          isTypeError: fetchError instanceof TypeError
        });

      // 方法2: 使用XMLHttpRequest作为备选
      try {
        addResult('登录测试-XHR', 'info', '尝试使用XMLHttpRequest...');

        const xhrPromise = new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', 'http://localhost:8001/api/auth/login', true);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.setRequestHeader('Accept', 'application/json');

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const data = JSON.parse(xhr.responseText);
                resolve({ status: xhr.status, data });
              } catch (e) {
                reject(new Error('Invalid JSON response'));
              }
            } else {
              reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
          };

          xhr.onerror = () => reject(new Error('Network error'));
          xhr.ontimeout = () => reject(new Error('Request timeout'));

          xhr.timeout = 10000;
          xhr.send(JSON.stringify({
            username: 'testuser',
            password: '123456'
          }));
        });

        const xhrResult = await xhrPromise;
        addResult('登录测试-XHR', 'success',
          'XHR登录成功！',
          {
            status: xhrResult.status,
            userData: xhrResult.data.user
          });
      } catch (xhrError) {
        addResult('登录测试-XHR', 'error',
          `XHR登录也失败: ${xhrError.message}`,
          {
            name: xhrError.name
          });
      }
    }

    // 6. 检查常见的网络问题
    addResult('网络问题检查', 'info', '检查常见网络问题...');

    // 检查是否在localhost
    const isLocalhost = window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1';
    addResult('网络问题检查', isLocalhost ? 'success' : 'warning',
      `主机名检查: ${window.location.hostname} ${isLocalhost ? '(✓ localhost)' : '(⚠ 非localhost)'}`);

    // 检查协议
    const isHttps = window.location.protocol === 'https:';
    const serverHttp = 'http:';
    addResult('网络问题检查', isHttps ? 'warning' : 'success',
      `协议检查: 页面使用${window.location.protocol}，服务器使用${serverHttp}${isHttps ? ' - 可能存在混合内容问题' : ' - 协议匹配'}`);

    // 7. 检查浏览器安全设置
    if ('serviceWorker' in navigator) {
      addResult('浏览器安全', 'info', 'Service Worker可用');
    }

    // 8. localStorage测试
    try {
      localStorage.setItem('testKey', 'testValue');
      const testValue = localStorage.getItem('testKey');
      localStorage.removeItem('testKey');
      addResult('LocalStorage', 'success', 'LocalStorage正常工作');
    } catch (e) {
      addResult('LocalStorage', 'error', `LocalStorage不可用: ${e.message}`);
    }

    addResult('诊断完成', 'info', '浏览器网络诊断完成');
    setIsRunning(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#2ecc71';
      case 'warning': return '#f39c12';
      case 'error': return '#e74c3c';
      case 'info': return '#3498db';
      default: return '#95a5a6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '📋';
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔍 浏览器网络深度诊断</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={runFullDiagnostic}
          disabled={isRunning}
          style={{
            padding: '12px 24px',
            backgroundColor: isRunning ? '#95a5a6' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {isRunning ? '🔄 诊断中...' : '🔬 开始完整诊断'}
        </button>

        <button
          onClick={clearResults}
          style={{
            padding: '12px 24px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          🗑️ 清除结果
        </button>
      </div>

      {diagnosticResults.length > 0 && (
        <div>
          <h2>📊 诊断结果</h2>
          <div style={{
            backgroundColor: '#2c3e50',
            color: '#ecf0f1',
            padding: '20px',
            borderRadius: '8px',
            maxHeight: '500px',
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '1.4'
          }}>
            {diagnosticResults.map((result, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '12px',
                  padding: '10px',
                  backgroundColor: getStatusColor(result.status) + '20',
                  borderLeft: `4px solid ${getStatusColor(result.status)}`,
                  borderRadius: '4px'
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  {getStatusIcon(result.status)} [{result.timestamp}] {result.test}
                </div>
                <div>{result.message}</div>
                {result.details && (
                  <details style={{ marginTop: '8px' }}>
                    <summary style={{ cursor: 'pointer', color: '#bdc3c7' }}>
                      查看详细信息
                    </summary>
                    <pre style={{
                      marginTop: '8px',
                      fontSize: '11px',
                      color: '#ecf0f1',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}>
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#ecf0f1', borderRadius: '8px' }}>
            <h3>📖 诊断结果解读</h3>
            <ul>
              <li><strong>✅ 成功</strong>: 该项测试通过</li>
              <li><strong>⚠️ 警告</strong>: 有潜在问题，但不影响功能</li>
              <li><strong>❌ 错误</strong>: 发现问题，需要修复</li>
              <li><strong>ℹ️ 信息</strong>: 参考信息</li>
            </ul>
            <p><strong>💡 建议</strong>: 如果看到CORS或网络错误，请查看详细信息中的具体错误消息。</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowserDiagnostics;