'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MousePointer, Code } from 'lucide-react';

export default function TestPage() {
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const triggerError = () => {
    throw new Error('这是一个测试异常');
  };

  const triggerPromiseError = () => {
    Promise.reject(new Error('这是一个Promise拒绝测试'));
  };

  const handleClick = () => {
    const now = Date.now();
    const timeDiff = now - lastClickTime;
    
    if (timeDiff <= 2000) {
      setClickCount(prev => prev + 1);
    } else {
      setClickCount(1);
    }
    
    setLastClickTime(now);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">RDebug 功能测试页面</h1>
        <p className="text-muted-foreground">
          这个页面用于测试埋点脚本的功能。请确保已经集成了埋点脚本。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              异常测试
            </CardTitle>
            <CardDescription>
              测试JavaScript异常捕获功能
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={triggerError}
              variant="destructive"
              className="w-full"
            >
              触发JavaScript异常
            </Button>
            
            <Button 
              onClick={triggerPromiseError}
              variant="outline"
              className="w-full"
            >
              触发Promise拒绝
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="h-5 w-5 text-primary" />
              快速点击测试
            </CardTitle>
            <CardDescription>
              测试2秒内点击3次触发DOM快照
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleClick}
              className="w-full"
            >
              点击我 ({clickCount}/3)
            </Button>
            
            <div className="text-sm text-muted-foreground">
              <p>当前点击次数: {clickCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-orange-500" />
              控制台错误测试
            </CardTitle>
            <CardDescription>
              测试控制台错误捕获功能
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => console.error('这是一个控制台错误测试')}
              variant="outline"
              className="w-full"
            >
              触发控制台错误
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
            <CardDescription>
              如何集成和使用埋点脚本
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-2">
              <p><strong>1. 集成脚本</strong></p>
              <pre className="bg-muted p-2 rounded text-xs">
                {`<script src="http://localhost:3000/api/script"></script>`}
              </pre>
              
              <p><strong>2. 测试功能</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>点击"触发JavaScript异常"测试异常捕获</li>
                <li>快速点击"点击我"按钮测试DOM快照</li>
                <li>点击"触发控制台错误"测试控制台错误捕获</li>
              </ul>
              
              <p><strong>3. 查看结果</strong></p>
              <p>访问异常记录和DOM快照页面查看结果。</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 