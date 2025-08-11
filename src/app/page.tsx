'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, MousePointer, Code, Download } from 'lucide-react';

interface Stats {
  errorCount: number;
  snapshotCount: number;
  networkRequestCount: number;
  sessionCount: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({ errorCount: 0, snapshotCount: 0, networkRequestCount: 0, sessionCount: 0 });
  const [serverUrl, setServerUrl] = useState('http://localhost:3000');

  useEffect(() => {
    // 获取统计数据
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [errorsRes, snapshotsRes, networkRequestsRes] = await Promise.all([
        fetch('/api/errors?limit=1'),
        fetch('/api/dom-snapshots?limit=1'),
        fetch('/api/network-requests?limit=1')
      ]);
      
      const errorsData = await errorsRes.json();
      const snapshotsData = await snapshotsRes.json();
      const networkRequestsData = await networkRequestsRes.json();
      
      setStats({
        errorCount: errorsData.pagination?.total || 0,
        snapshotCount: snapshotsData.pagination?.total || 0,
        networkRequestCount: networkRequestsData.requests?.length || 0,
        sessionCount: 0 // 暂时设为0，后续可以添加会话统计
      });
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  const generateScript = () => {
    const scriptUrl = `${serverUrl}/api/script?serverUrl=${encodeURIComponent(serverUrl)}`;
    const scriptTag = `<script src="${scriptUrl}"></script>`;
    
    // 复制到剪贴板
    navigator.clipboard.writeText(scriptTag);
    alert('脚本标签已复制到剪贴板！');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">RDebug 埋点搜集系统</h1>
        <p className="text-muted-foreground">简单的网站异常和DOM结构搜集系统</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">异常记录</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.errorCount}</div>
            <p className="text-xs text-muted-foreground">总异常数量</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DOM快照</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.snapshotCount}</div>
            <p className="text-xs text-muted-foreground">总快照数量</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">网络请求</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.networkRequestCount}</div>
            <p className="text-xs text-muted-foreground">总请求数量</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃会话</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sessionCount}</div>
            <p className="text-xs text-muted-foreground">当前活跃会话</p>
          </CardContent>
        </Card>
      </div>

      {/* 主要功能区域 */}
      <Tabs defaultValue="script" className="space-y-4">
        <TabsList>
          <TabsTrigger value="script">嵌入脚本</TabsTrigger>
          <TabsTrigger value="errors">异常记录</TabsTrigger>
          <TabsTrigger value="snapshots">DOM快照</TabsTrigger>
          <TabsTrigger value="network">网络请求</TabsTrigger>
        </TabsList>

        <TabsContent value="script" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>生成嵌入脚本</CardTitle>
              <CardDescription>
                为您的网站生成埋点脚本，用于搜集异常和DOM结构
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">服务器地址</label>
                <input
                  type="text"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-input rounded-md"
                  placeholder="http://localhost:3000"
                />
              </div>
              
              <Button onClick={generateScript} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                生成并复制脚本标签
              </Button>
              
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm font-medium mb-2">使用方法：</p>
                <ol className="text-sm space-y-1">
                  <li>1. 点击上方按钮生成脚本标签</li>
                  <li>2. 将生成的脚本标签添加到您的网站HTML中</li>
                  <li>3. 脚本会自动搜集异常和DOM结构</li>
                  <li>4. 在2秒内快速点击3次会触发DOM快照</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>异常记录</CardTitle>
              <CardDescription>
                查看所有搜集到的异常信息
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.href = '/errors'}>
                查看异常记录
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="snapshots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DOM快照</CardTitle>
              <CardDescription>
                查看所有DOM结构快照
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.href = '/snapshots'}>
                查看DOM快照
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>网络请求</CardTitle>
              <CardDescription>
                查看所有AJAX网络请求记录
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.href = '/network-requests'}>
                查看网络请求
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 