'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

interface ErrorLog {
  id: string;
  url: string;
  message: string;
  stack?: string;
  userAgent: string;
  timestamp: string;
  sessionId: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function ErrorsPage() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);

  useEffect(() => {
    fetchErrors();
  }, [pagination.page]);

  const fetchErrors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/errors?page=${pagination.page}&limit=${pagination.limit}`);
      const data = await response.json();
      
      if (data.errors) {
        setErrors(data.errors);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('获取异常数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        <h1 className="text-3xl font-bold mb-2">异常记录</h1>
        <p className="text-muted-foreground">查看所有搜集到的异常信息</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 异常列表 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                异常列表
              </CardTitle>
              <CardDescription>
                共 {pagination.total} 条异常记录
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">加载中...</div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>时间</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>异常信息</TableHead>
                        <TableHead>会话ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {errors.map((error) => (
                        <TableRow 
                          key={error.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedError(error)}
                        >
                          <TableCell className="font-mono text-xs">
                            {formatDate(error.timestamp)}
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <div className="truncate" title={error.url}>
                              {error.url}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[300px]">
                            <div className="truncate" title={error.message}>
                              {truncateText(error.message, 50)}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {error.sessionId.substring(0, 8)}...
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* 分页 */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      第 {pagination.page} 页，共 {pagination.pages} 页
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page <= 1}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page >= pagination.pages}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 异常详情 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>异常详情</CardTitle>
              <CardDescription>
                {selectedError ? '查看异常详细信息' : '选择一个异常查看详情'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedError ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">时间</label>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedError.timestamp)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">URL</label>
                    <p className="text-sm text-muted-foreground break-all">
                      {selectedError.url}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">异常信息</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedError.message}
                    </p>
                  </div>
                  
                  {selectedError.stack && (
                    <div>
                      <label className="text-sm font-medium">堆栈信息</label>
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                        {selectedError.stack}
                      </pre>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium">用户代理</label>
                    <p className="text-xs text-muted-foreground break-all">
                      {selectedError.userAgent}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">会话ID</label>
                    <p className="text-xs text-muted-foreground font-mono">
                      {selectedError.sessionId}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  选择一个异常查看详细信息
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 