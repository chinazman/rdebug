import { NextRequest, NextResponse } from 'next/server';
import { withCors } from '@/lib/cors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serverUrl = searchParams.get('serverUrl') || 'http://localhost:3000';

    const script = `
(function() {
  'use strict';
  
  // 配置
  const config = {
    serverUrl: '${serverUrl}',
    sessionId: generateSessionId(),
    clickTimeout: 2000, // 2秒内点击3次
    clickCount: 3
  };
  
  // 生成会话ID
  function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  // 发送数据到服务器
  async function sendData(endpoint, data) {
    try {
      const response = await fetch(config.serverUrl + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        console.error('RDebug: 发送数据失败', response.status);
      }
    } catch (error) {
      console.error('RDebug: 发送数据错误', error);
    }
  }
  
  // 发送异常数据
  function sendError(error) {
    const errorData = {
      url: window.location.href,
      message: error.message || error.toString(),
      stack: error.stack,
      userAgent: navigator.userAgent,
      sessionId: config.sessionId
    };
    
    sendData('/api/errors', errorData);
  }
  
  // 发送DOM快照
  function sendDomSnapshot(clickCount) {
    const domData = {
      url: window.location.href,
      domStructure: document.documentElement.outerHTML,
      userAgent: navigator.userAgent,
      sessionId: config.sessionId,
      clickCount: clickCount
    };
    
    sendData('/api/dom-snapshots', domData);
  }
  
  // 点击计数器
  let clickTimes = [];
  
  // 监听点击事件
  document.addEventListener('click', function() {
    const now = Date.now();
    clickTimes.push(now);
    
    // 只保留最近2秒内的点击
    clickTimes = clickTimes.filter(time => now - time <= config.clickTimeout);
    
    // 如果2秒内点击了3次，发送DOM快照
    if (clickTimes.length >= config.clickCount) {
      sendDomSnapshot(clickTimes.length);
      clickTimes = []; // 重置计数器
    }
  });
  
  // 监听全局异常
  window.addEventListener('error', function(event) {
    sendError(event.error || new Error(event.message));
  });
  
  // 监听未处理的Promise拒绝
  window.addEventListener('unhandledrejection', function(event) {
    sendError(new Error(event.reason));
  });
  
  // 监听控制台错误
  const originalConsoleError = console.error;
  console.error = function(...args) {
    originalConsoleError.apply(console, args);
    sendError(new Error(args.join(' ')));
  };
  
  console.log('RDebug: 埋点脚本已加载');
})();
`;

    const res = new NextResponse(script, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache',
      },
    });
    return withCors(request, res);
  } catch (error) {
    console.error('生成脚本失败:', error);
    return withCors(request, NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    ));
  }
}

export function OPTIONS(request: NextRequest) {
  return withCors(request, new NextResponse(null, { status: 204 }));
} 