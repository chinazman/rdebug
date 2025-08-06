'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MousePointer, ArrowLeft, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface DomSnapshot {
  id: string;
  url: string;
  domStructure: string;
  userAgent: string;
  timestamp: string;
  sessionId: string;
  clickCount: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function SnapshotsPage() {
  const [snapshots, setSnapshots] = useState<DomSnapshot[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedSnapshot, setSelectedSnapshot] = useState<DomSnapshot | null>(null);
  const [showDomViewer, setShowDomViewer] = useState(false);

  useEffect(() => {
    fetchSnapshots();
  }, [pagination.page]);

  const fetchSnapshots = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/dom-snapshots?page=${pagination.page}&limit=${pagination.limit}`);
      const data = await response.json();
      
      if (data.snapshots) {
        setSnapshots(data.snapshots);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('获取DOM快照失败:', error);
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

  const formatDomSize = (domString: string) => {
    const size = new Blob([domString]).size;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
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
        <h1 className="text-3xl font-bold mb-2">DOM快照</h1>
        <p className="text-muted-foreground">查看所有DOM结构快照</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 快照列表 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="h-5 w-5" />
                DOM快照列表
              </CardTitle>
              <CardDescription>
                共 {pagination.total} 个DOM快照
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
                        <TableHead>点击次数</TableHead>
                        <TableHead>DOM大小</TableHead>
                        <TableHead>会话ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {snapshots.map((snapshot) => (
                        <TableRow 
                          key={snapshot.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedSnapshot(snapshot)}
                        >
                          <TableCell className="font-mono text-xs">
                            {formatDate(snapshot.timestamp)}
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <div className="truncate" title={snapshot.url}>
                              {snapshot.url}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                              {snapshot.clickCount} 次
                            </span>
                          </TableCell>
                          <TableCell className="text-xs">
                            {formatDomSize(snapshot.domStructure)}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {snapshot.sessionId.substring(0, 8)}...
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

        {/* 快照详情 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>快照详情</CardTitle>
              <CardDescription>
                {selectedSnapshot ? '查看DOM快照详细信息' : '选择一个快照查看详情'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSnapshot ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">时间</label>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedSnapshot.timestamp)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">URL</label>
                    <p className="text-sm text-muted-foreground break-all">
                      {selectedSnapshot.url}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">点击次数</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedSnapshot.clickCount} 次
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">DOM大小</label>
                    <p className="text-sm text-muted-foreground">
                      {formatDomSize(selectedSnapshot.domStructure)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">用户代理</label>
                    <p className="text-xs text-muted-foreground break-all">
                      {selectedSnapshot.userAgent}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">会话ID</label>
                    <p className="text-xs text-muted-foreground font-mono">
                      {selectedSnapshot.sessionId}
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => setShowDomViewer(true)}
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    查看DOM结构
                  </Button>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  选择一个快照查看详细信息
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* DOM查看器模态框 */}
      {showDomViewer && selectedSnapshot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">DOM结构查看器</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowDomViewer(false)}
              >
                ✕
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-xs bg-muted p-4 rounded overflow-auto h-full">
                {selectedSnapshot.domStructure}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 