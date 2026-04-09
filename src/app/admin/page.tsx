'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Search, RefreshCw, Eye, ChevronLeft, ChevronRight, Camera, Lock, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ExamRecord {
  id: string;
  work_type: string;
  name: string;
  id_card: string;
  phone: string;
  score: number;
  submitted_at: string;
}

interface ExamDetail extends ExamRecord {
  photo_url?: string;
  answers?: Record<string, string>;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [records, setRecords] = useState<ExamRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchName, setSearchName] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ExamDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const limit = 15;

  // 简单的前端密码验证（实际生产环境应使用服务端验证）
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

  useEffect(() => {
    // 检查是否已验证过
    const authed = sessionStorage.getItem('admin_authenticated');
    if (authed === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecords();
    }
  }, [page, isAuthenticated]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
      sessionStorage.setItem('admin_authenticated', 'true');
    } else {
      setAuthError('密码错误，请重试');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    sessionStorage.removeItem('admin_authenticated');
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/exam?page=${page}&limit=${limit}`);
      const result = await response.json();
      if (result.success) {
        setRecords(result.data);
        setTotal(result.total);
      }
    } catch (err) {
      console.error('获取记录失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecordDetail = async (id: string) => {
    setLoadingDetail(true);
    try {
      const response = await fetch(`/api/exam/records/${id}`);
      const result = await response.json();
      if (result.success) {
        setSelectedRecord(result.data);
      }
    } catch (err) {
      console.error('获取详情失败:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const filteredRecords = searchName
    ? records.filter(r => r.name.includes(searchName) || r.id_card.includes(searchName) || r.phone.includes(searchName))
    : records;

  const totalPages = Math.ceil(total / limit);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // 登录页面
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">管理端访问</CardTitle>
            <p className="text-slate-500 text-sm mt-2">请输入访问密码</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="pl-10"
              />
            </div>
            {authError && (
              <p className="text-red-500 text-sm text-center">{authError}</p>
            )}
            <Button onClick={handleLogin} className="w-full">
              登录
            </Button>
            <Button variant="outline" onClick={() => router.push('/')} className="w-full">
              返回首页
            </Button>
            <p className="text-xs text-slate-400 text-center">
              默认密码：admin123（可在环境变量 NEXT_PUBLIC_ADMIN_PASSWORD 修改）
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-primary text-primary-foreground py-4 shadow">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="text-primary-foreground hover:bg-primary-foreground/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">考试成绩管理</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-primary-foreground border-primary-foreground/50 hover:bg-primary-foreground/20">
            退出登录
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>考试记录列表</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="搜索姓名/身份证/电话"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <Button variant="outline" size="icon" onClick={fetchRecords}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                暂无考试记录
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>序号</TableHead>
                        <TableHead>姓名</TableHead>
                        <TableHead>工种</TableHead>
                        <TableHead>身份证号</TableHead>
                        <TableHead>电话</TableHead>
                        <TableHead>分数</TableHead>
                        <TableHead>提交时间</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record, index) => (
                        <TableRow key={record.id}>
                          <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                          <TableCell className="font-medium">{record.name}</TableCell>
                          <TableCell>{record.work_type}</TableCell>
                          <TableCell className="font-mono text-sm">{record.id_card}</TableCell>
                          <TableCell>{record.phone}</TableCell>
                          <TableCell>
                            <Badge className={getScoreColor(record.score)}>
                              {record.score}分
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-slate-500">
                            {formatDate(record.submitted_at)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => fetchRecordDetail(record.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              详情
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* 分页 */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <p className="text-sm text-slate-500">
                      共 {total} 条记录，第 {page} / {totalPages} 页
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        上一页
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                      >
                        下一页
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{total}</div>
                <p className="text-slate-500 text-sm">总考试人数</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {records.filter(r => r.score >= 60).length}
                </div>
                <p className="text-slate-500 text-sm">及格人数</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {total > 0 ? Math.round(records.reduce((acc, r) => acc + r.score, 0) / records.length) : 0}分
                </div>
                <p className="text-slate-500 text-sm">平均分</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* 详情弹窗 */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>考试详情</DialogTitle>
          </DialogHeader>
          {loadingDetail ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : selectedRecord ? (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">基本信息</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500">姓名：</span>
                    <span className="font-medium">{selectedRecord.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">工种：</span>
                    <span className="font-medium">{selectedRecord.work_type}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">身份证号：</span>
                    <span className="font-mono">{selectedRecord.id_card}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">电话：</span>
                    <span>{selectedRecord.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">考试分数：</span>
                    <Badge className={getScoreColor(selectedRecord.score)}>
                      {selectedRecord.score}分
                    </Badge>
                  </div>
                  <div>
                    <span className="text-slate-500">提交时间：</span>
                    <span>{formatDate(selectedRecord.submitted_at)}</span>
                  </div>
                </div>
              </div>

              {/* 答题照片 */}
              {selectedRecord.photo_url && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    答题照片
                  </h3>
                  <img
                    src={selectedRecord.photo_url}
                    alt="答题照片"
                    className="max-w-full rounded-lg border"
                  />
                </div>
              )}

              {/* 答题详情 */}
              {selectedRecord.answers && (
                <div>
                  <h3 className="font-semibold mb-3">答题详情</h3>
                  <div className="space-y-3">
                    {Object.entries(selectedRecord.answers).map(([questionId, answer], index) => (
                      <div key={questionId} className="p-3 bg-slate-50 rounded-lg text-sm">
                        <p className="text-slate-500">第{index + 1}题答案：{answer || '(未作答)'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
