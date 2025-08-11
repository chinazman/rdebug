'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NetworkRequest {
  id: string;
  url: string;
  method: string;
  status: number | null;
  statusText: string | null;
  responseTime: number | null;
  requestHeaders: string | null;
  responseHeaders: string | null;
  requestBody: string | null;
  responseBody: string | null;
  error: string | null;
  userAgent: string;
  sessionId: string;
  timestamp: string;
}

export default function NetworkRequestsPage() {
  const [requests, setRequests] = useState<NetworkRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/network-requests');
      if (!response.ok) {
        throw new Error('获取网络请求数据失败');
      }
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  const formatResponseTime = (time: number | null) => {
    if (time === null) return '-';
    return `${time}ms`;
  };

  const getStatusColor = (status: number | null) => {
    if (status === null) return 'text-gray-500';
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 400 && status < 500) return 'text-yellow-600';
    if (status >= 500) return 'text-red-600';
    return 'text-gray-500';
  };

  const getMethodColor = (method: string) => {
    const colors: { [key: string]: string } = {
      GET: 'bg-blue-100 text-blue-800',
      POST: 'bg-green-100 text-green-800',
      PUT: 'bg-yellow-100 text-yellow-800',
      DELETE: 'bg-red-100 text-red-800',
      PATCH: 'bg-purple-100 text-purple-800'
    };
    return colors[method] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-red-600">错误: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">网络请求监控</h1>
        <p className="text-gray-600">实时监控页面中的所有AJAX网络请求</p>
      </div>

      <div className="mb-4">
        <button
          onClick={fetchRequests}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          刷新数据
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>网络请求列表 ({requests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              暂无网络请求数据
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>时间</TableHead>
                  <TableHead>方法</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>响应时间</TableHead>
                  <TableHead>会话ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="text-sm">
                      {formatTime(request.timestamp)}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(request.method)}`}>
                        {request.method}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={request.url}>
                      {request.url}
                    </TableCell>
                    <TableCell className={getStatusColor(request.status)}>
                      {request.status || '-'}
                    </TableCell>
                    <TableCell>
                      {formatResponseTime(request.responseTime)}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {request.sessionId}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {requests.length > 0 && (
        <div className="mt-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList>
              <TabsTrigger value="details">详细信息</TabsTrigger>
              <TabsTrigger value="errors">错误请求</TabsTrigger>
              <TabsTrigger value="slow">慢请求</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>请求详细信息</CardTitle>
                </CardHeader>
                <CardContent>
                  {requests.map((request) => (
                    <details key={request.id} className="mb-4 border rounded p-4">
                      <summary className="cursor-pointer font-medium mb-2">
                        {request.method} {request.url}
                      </summary>
                      <div className="space-y-2 text-sm">
                        <div><strong>状态:</strong> {request.status} {request.statusText}</div>
                        <div><strong>响应时间:</strong> {formatResponseTime(request.responseTime)}</div>
                        <div><strong>时间:</strong> {formatTime(request.timestamp)}</div>
                        {request.error && (
                          <div><strong>错误:</strong> <span className="text-red-600">{request.error}</span></div>
                        )}
                        {request.requestBody && (
                          <div>
                            <strong>请求体:</strong>
                            <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
                              {request.requestBody}
                            </pre>
                          </div>
                        )}
                        {request.responseBody && (
                          <div>
                            <strong>响应体:</strong>
                            <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto max-h-40 overflow-y-auto">
                              {request.responseBody}
                            </pre>
                          </div>
                        )}
                      </div>
                    </details>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="errors" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>错误请求</CardTitle>
                </CardHeader>
                <CardContent>
                  {requests.filter(r => r.error || (r.status && r.status >= 400)).map((request) => (
                    <div key={request.id} className="border rounded p-4 mb-4 bg-red-50">
                      <div className="font-medium text-red-800">
                        {request.method} {request.url}
                      </div>
                      <div className="text-sm text-red-600 mt-1">
                        状态: {request.status} {request.statusText}
                      </div>
                      {request.error && (
                        <div className="text-sm text-red-600 mt-1">
                          错误: {request.error}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="slow" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>慢请求 (&gt;1000ms)</CardTitle>
                </CardHeader>
                <CardContent>
                  {requests.filter(r => r.responseTime && r.responseTime > 1000).map((request) => (
                    <div key={request.id} className="border rounded p-4 mb-4 bg-yellow-50">
                      <div className="font-medium">
                        {request.method} {request.url}
                      </div>
                      <div className="text-sm text-yellow-600 mt-1">
                        响应时间: {formatResponseTime(request.responseTime)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
} 