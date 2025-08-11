'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testFetch = async () => {
    try {
      addResult('开始测试fetch请求...');
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      const data = await response.json();
      addResult(`Fetch成功: ${data.title}`);
    } catch (error) {
      addResult(`Fetch失败: ${error}`);
    }
  };

  const testXHR = () => {
    addResult('开始测试XMLHttpRequest...');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts/2');
    xhr.onload = function() {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        addResult(`XHR成功: ${data.title}`);
      } else {
        addResult(`XHR失败: ${xhr.status}`);
      }
    };
    xhr.onerror = function() {
      addResult('XHR网络错误');
    };
    xhr.send();
  };

  const testErrorRequest = async () => {
    try {
      addResult('开始测试错误请求...');
      await fetch('https://httpstat.us/404');
      addResult('404请求完成');
    } catch (error) {
      addResult(`错误请求失败: ${error}`);
    }
  };

  const testSlowRequest = async () => {
    try {
      addResult('开始测试慢请求...');
      await fetch('https://httpstat.us/200?sleep=2000');
      addResult('慢请求完成');
    } catch (error) {
      addResult(`慢请求失败: ${error}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">RDebug 测试页面</h1>
        <p className="text-gray-600">测试各种网络请求的捕获功能</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>网络请求测试</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testFetch} className="w-full">
              测试 Fetch 请求
            </Button>
            <Button onClick={testXHR} className="w-full">
              测试 XMLHttpRequest
            </Button>
            <Button onClick={testErrorRequest} className="w-full">
              测试错误请求 (404)
            </Button>
            <Button onClick={testSlowRequest} className="w-full">
              测试慢请求 (2秒)
            </Button>
            <Button onClick={clearResults} variant="outline" className="w-full">
              清空结果
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>测试结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 overflow-y-auto bg-gray-50 p-4 rounded">
              {testResults.length === 0 ? (
                <p className="text-gray-500">暂无测试结果</p>
              ) : (
                <div className="space-y-1">
                  {testResults.map((result, index) => (
                    <div key={index} className="text-sm font-mono">
                      {result}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>1. 点击上方按钮测试不同类型的网络请求</p>
              <p>2. 所有请求都会被RDebug脚本捕获并发送到服务器</p>
              <p>3. 可以在 <a href="/network-requests" className="text-blue-600 hover:underline">网络请求页面</a> 查看捕获的数据</p>
              <p>4. 注意：发送到 /api/ 的请求会被自动排除，避免循环</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 