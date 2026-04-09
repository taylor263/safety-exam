'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Search, Users, CheckCircle, XCircle, 
  Calendar, Eye, Clock
} from 'lucide-react';
import { workTypes } from '@/lib/questions';

interface ExamRecord {
  id: number;
  work_type: string;
  name: string;
  id_card: string;
  phone: string;
  exam_module: string;
  score: number;
  photo_key: string;
  answers: string;
  submitted_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [records, setRecords] = useState<ExamRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<ExamRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ExamRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const adminAuth = sessionStorage.getItem('admin_auth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      fetchRecords();
    }
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = records.filter(r => 
        r.name.includes(searchTerm) ||
        r.work_type.includes(searchTerm) ||
        r.phone.includes(searchTerm) ||
        r.id_card.includes(searchTerm)
      );
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(records);
    }
  }, [searchTerm, records]);

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      fetchRecords();
    } else {
      alert('密码错误');
    }
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/exam');
      const data = await response.json();
      if (data.success) {
        setRecords(data.data);
        setFilteredRecords(data.data);
      }
    } catch (err) {
      console.error('获取记录失败', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  const getModuleName = (module: string) => {
    const wt = workTypes.find(w => w.id === module);
    return wt?.name || module;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    return 'text-red-600 bg-red-50';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const parseAnswers = (answersStr: string) => {
    try {
      return JSON.parse(answersStr);
    } catch {
      return {};
    }
  };

  // ==================== 登录页面 ====================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-sm w-full shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">管理端登录</CardTitle>
            <p className="text-slate-500 text-sm mt-1">请输入管理员密码</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="h-12 text-center"
            />
            <Button onClick={handleLogin} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
              登录
            </Button>
            <Button variant="outline" onClick={() => router.push('/')} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回首页
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ==================== 详情弹窗 ====================
  if (selectedRecord) {
    const answers = parseAnswers(selectedRecord.answers);
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSelectedRecord(null)} className="text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold">考试详情</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">姓名</p>
                <p className="font-semibold">{selectedRecord.name}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">公司名称</p>
                <p className="font-semibold text-sm">{selectedRecord.work_type}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">身份证号</p>
                <p className="font-semibold text-sm font-mono">{selectedRecord.id_card}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">手机号</p>
                <p className="font-semibold">{selectedRecord.phone}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">考试模块</p>
                <p className="font-semibold text-sm">{getModuleName(selectedRecord.exam_module)}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">考试时间</p>
                <p className="font-semibold text-sm">{formatDate(selectedRecord.submitted_at)}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg md:col-span-2">
                <p className="text-xs text-slate-500 mb-1">成绩</p>
                <div className="flex items-center gap-2">
                  <span className={`text-3xl font-bold ${selectedRecord.score >= 80 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedRecord.score}
                  </span>
                  <span className="text-slate-500">分</span>
                  {selectedRecord.score >= 80 ? (
                    <Badge className="bg-green-600">及格</Badge>
                  ) : (
                    <Badge className="bg-red-600">不及格</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>答题详情</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-6">
                <p className="text-amber-800 text-sm">
                  <Clock className="h-4 w-4 inline mr-1" />
                  以下为系统记录的用户答题内容，仅供参考
                </p>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {Object.entries(answers).map(([questionId, answer], index) => (
                  <div key={questionId} className="bg-slate-50 p-3 rounded-lg flex items-start gap-3">
                    <span className="font-semibold text-slate-600">{index + 1}.</span>
                    <span className="flex-1">{String(answer)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // ==================== 记录列表页面 ====================
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">考试成绩管理</h1>
              <p className="text-xs text-blue-200">共 {records.length} 条记录</p>
            </div>
          </div>
          <Button variant="secondary" onClick={handleLogout} className="bg-white/20 text-white hover:bg-white/30 border-0">
            退出登录
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{records.length}</p>
                <p className="text-sm text-slate-500">总考试人数</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {records.filter(r => r.score >= 80).length}
                </p>
                <p className="text-sm text-slate-500">及格人数</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {records.filter(r => r.score < 80).length}
                </p>
                <p className="text-sm text-slate-500">不及格人数</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 搜索框 */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="搜索姓名、公司名称、手机号、身份证号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </CardContent>
        </Card>

        {/* 记录列表 */}
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center text-slate-500">
              加载中...
            </CardContent>
          </Card>
        ) : filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-slate-500">
              暂无考试记录
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-600 text-sm">姓名</th>
                    <th className="text-left p-4 font-semibold text-slate-600 text-sm hidden md:table-cell">公司名称</th>
                    <th className="text-left p-4 font-semibold text-slate-600 text-sm hidden lg:table-cell">考试模块</th>
                    <th className="text-left p-4 font-semibold text-slate-600 text-sm">成绩</th>
                    <th className="text-left p-4 font-semibold text-slate-600 text-sm hidden sm:table-cell">提交时间</th>
                    <th className="text-center p-4 font-semibold text-slate-600 text-sm">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold">{record.name}</div>
                        <div className="text-sm text-slate-500 md:hidden">{record.work_type}</div>
                      </td>
                      <td className="p-4 text-sm hidden md:table-cell">{record.work_type}</td>
                      <td className="p-4 hidden lg:table-cell">
                        <Badge variant="outline" className="text-xs">
                          {getModuleName(record.exam_module)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold ${getScoreColor(record.score)}`}>
                          {record.score >= 80 ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          {record.score}分
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-500 hidden sm:table-cell">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(record.submitted_at)}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedRecord(record)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          详情
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
