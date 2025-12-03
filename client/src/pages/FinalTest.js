import React, { useEffect } from 'react';

const FinalTest = () => {
  useEffect(() => {
    console.log('FinalTest component mounted');
    document.title = 'FinalTest - 最终测试';
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#ff4757',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'linear-gradient(45deg, #ff4757, #ff6348)',
      position: 'relative'
    }}>
      {/* 覆盖任何其他内容的绝对定位层 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#ff4757',
        zIndex: 1000
      }} />

      {/* 主要内容 */}
      <div style={{
        position: 'relative',
        zIndex: 1001,
        backgroundColor: '#ffffff',
        padding: '60px 50px',
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
        maxWidth: '700px',
        margin: '20px',
        border: '5px solid #ffffff'
      }}>
        <h1 style={{
          color: '#ff4757',
          fontSize: '56px',
          marginBottom: '30px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          🎉 成功了！🎉
        </h1>

        <p style={{
          color: '#2c3e50',
          fontSize: '28px',
          marginBottom: '50px',
          lineHeight: '1.5',
          fontWeight: '500'
        }}>
          如果你看到这个红色背景的页面<br/>
          说明组件渲染完全正常！
        </p>

        <div style={{ marginBottom: '40px' }}>
          <button
            onClick={() => {
              alert('🔵 蓝色按钮点击成功！组件正常工作！');
              document.body.style.backgroundColor = '#3498db';
            }}
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              padding: '25px 50px',
              fontSize: '28px',
              borderRadius: '15px',
              cursor: 'pointer',
              margin: '15px',
              fontWeight: 'bold',
              boxShadow: '0 8px 25px rgba(52,152,219,0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            🔵 蓝色大按钮
          </button>

          <button
            onClick={() => {
              alert('🟢 绿色按钮点击成功！组件正常工作！');
              document.body.style.backgroundColor = '#27ae60';
            }}
            style={{
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              padding: '25px 50px',
              fontSize: '28px',
              borderRadius: '15px',
              cursor: 'pointer',
              margin: '15px',
              fontWeight: 'bold',
              boxShadow: '0 8px 25px rgba(39,174,96,0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            🟢 绿色大按钮
          </button>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '40px',
          borderRadius: '20px',
          marginTop: '40px',
          border: '3px solid #e9ecef'
        }}>
          <h3 style={{
            color: '#495057',
            fontSize: '24px',
            marginBottom: '25px',
            fontWeight: 'bold'
          }}>
            ✅ 测试成功项目：
          </h3>
          <div style={{ textAlign: 'left', display: 'inline-block' }}>
            <p style={{ color: '#27ae60', fontSize: '20px', margin: '15px 0', fontWeight: 'bold' }}>
              ✅ 红色渐变背景显示
            </p>
            <p style={{ color: '#27ae60', fontSize: '20px', margin: '15px 0', fontWeight: 'bold' }}>
              ✅ 白色容器框显示
            </p>
            <p style={{ color: '#27ae60', fontSize: '20px', margin: '15px 0', fontWeight: 'bold' }}>
              ✅ 大标题显示正常
            </p>
            <p style={{ color: '#27ae60', fontSize: '20px', margin: '15px 0', fontWeight: 'bold' }}>
              ✅ 两个可点击大按钮
            </p>
            <p style={{ color: '#27ae60', fontSize: '20px', margin: '15px 0', fontWeight: 'bold' }}>
              ✅ 按钮点击功能正常
            </p>
          </div>
        </div>

        <div style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#fff3cd',
          borderRadius: '15px',
          border: '2px solid #ffeaa7'
        }}>
          <p style={{ color: '#856404', fontSize: '18px', margin: '10px 0', fontWeight: 'bold' }}>
            💡 提示：点击按钮会弹窗并改变页面背景色
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinalTest;