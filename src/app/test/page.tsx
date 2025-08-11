'use client'

import { useCallback, useEffect } from 'react'
import Script from 'next/script'

export default function TestPage() {
  const triggerError = useCallback(() => {
    // 与 test.html 保持一致：故意触发未定义变量错误
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    (window as any).undefinedVariable.someMethod()
  }, [])

  const triggerWarning = useCallback(() => {
    console.warn('这是一个警告信息')
    console.warn('浏览器不支持某些特性')
    console.warn('建议使用现代浏览器')
  }, [])

  const logInfo = useCallback(() => {
    console.log('这是一条普通信息')
    console.info('vConsole 工作正常')
    console.log('当前时间:', new Date().toLocaleString())
    console.log('用户代理:', navigator.userAgent)
  }, [])

  const requestSuccess = useCallback(async () => {
    console.log('开始请求成功接口...')
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
      console.log('响应状态:', response.status, response.statusText)
      const data = await response.json()
      console.log('成功数据:', data)
    } catch (error) {
      console.error('请求成功接口时发生网络错误:', error)
    }
  }, [])

  const requestFail = useCallback(async () => {
    console.log('开始请求失败接口...')
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/invalid-endpoint')
      console.log('响应状态:', response.status, response.statusText)
      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}${text ? ' - ' + text : ''}`)
      }
      const data = await response.json()
      console.log('意外成功数据:', data)
    } catch (error) {
      console.error('失败请求捕获到错误:', error)
    }
  }, [])

  useEffect(() => {
    console.log('页面加载完成，vConsole 已初始化')
    console.log('点击右下角的 vConsole 图标打开调试面板')
  }, [])

  return (
    <div className="page-wrapper">
      {/* 与 test.html 中 script 一致，保留 serverUrl 参数 */}
      <Script src="http://localhost:3000/api/script?serverUrl=http%3A%2F%2Flocalhost%3A3000" strategy="afterInteractive" />

      <div className="container">
        <h1>测试页面</h1>
        <div className="button-group">
          <button className="error-btn" onClick={triggerError}>触发 JavaScript 错误</button>
          <button className="warning-btn" onClick={triggerWarning}>触发警告信息</button>
          <button className="info-btn" onClick={logInfo}>输出普通信息</button>
          <button className="success-btn" onClick={requestSuccess}>请求接口成功</button>
          <button className="fail-btn" onClick={requestFail}>请求接口失败</button>
        </div>
      </div>

      <style jsx>{`
        .page-wrapper {
          display: flex;
          min-height: calc(100dvh - var(--app-header-offset, 0px));
          background-color: #f5f5f5;
          font-family: Arial, sans-serif;
        }
        .container {
          background: #ffffff;
          max-width: 800px;
          margin: 0 auto;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          align-self: center;
          width: 100%;
        }
        h1 {
          color: #333;
          text-align: center;
          margin-bottom: 30px;
        }
        .button-group {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 30px;
        }
        button {
          padding: 15px 25px;
          font-size: 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #fff;
        }
        .error-btn { background-color: #ff4757; }
        .error-btn:hover { background-color: #ff3742; transform: translateY(-2px); }
        .info-btn { background-color: #2ed573; }
        .info-btn:hover { background-color: #26d0ce; transform: translateY(-2px); }
        .warning-btn { background-color: #ffa502; }
        .warning-btn:hover { background-color: #ff9500; transform: translateY(-2px); }
        .success-btn { background-color: #1e90ff; }
        .success-btn:hover { background-color: #187bcd; transform: translateY(-2px); }
        .fail-btn { background-color: #e84393; }
        .fail-btn:hover { background-color: #d63384; transform: translateY(-2px); }
      `}</style>
    </div>
  )
}


