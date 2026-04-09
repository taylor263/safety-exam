'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, Search, Users, CheckCircle, XCircle, 
  Calendar, Eye, Clock, Building2, CreditCard, Phone,
  FileText, CircleDot, CheckSquare, AlignLeft
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

// 详细答题记录结构
interface DetailedAnswer {
  questionId: string;
  question: string | null;
  type: string | null;
  options: string[] | null;
  userAnswer: string;
  correctAnswer: string | null;
  isCorrect: boolean;
  explanation?: string;
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

  // 隐藏部分身份证号，保护隐私
  const maskIdCard = (idCard: string) => {
    if (idCard.length === 18) {
      return idCard.substring(0, 6) + '********' + idCard.substring(14);
    }
    return idCard;
  };

  // 隐藏部分手机号，保护隐私
  const maskPhone = (phone: string) => {
    if (phone.length === 11) {
      return phone.substring(0, 3) + '****' + phone.substring(7);
    }
    return phone;
  };

  // 获取题目类型标签
  const getQuestionTypeInfo = (type: string | null) => {
    switch (type) {
      case 'choice':
        return { label: '选择题', icon: CheckSquare, color: 'text-blue-600 bg-blue-50' };
      case 'judge':
        return { label: '判断题', icon: CircleDot, color: 'text-green-600 bg-green-50' };
      case 'fill':
        return { label: '填空题', icon: AlignLeft, color: 'text-purple-600 bg-purple-50' };
      default:
        return { label: '未知', icon: FileText, color: 'text-slate-600 bg-slate-50' };
    }
  };

  // 解析答题详情
  const parseAnswers = (answersStr: string): DetailedAnswer[] => {
    try {
      return JSON.parse(answersStr);
    } catch {
      return [];
    }
  };

  // 统计正确率
  const getAnswerStats = (answers: DetailedAnswer[]) => {
    const total = answers.length;
    const correct = answers.filter(a => a.isCorrect).length;
    const choiceCount = answers.filter(a => a.type === 'choice').length;
    const judgeCount = answers.filter(a => a.type === 'judge').length;
    const fillCount = answers.filter(a => a.type === 'fill').length;
    const correctChoice = answers.filter(a => a.type === 'choice' && a.isCorrect).length;
    const correctJudge = answers.filter(a => a.type === 'judge' && a.isCorrect).length;
    const correctFill = answers.filter(a => a.type === 'fill' && a.isCorrect).length;
    
    return {
      total,
      correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      choiceCount,
      judgeCount,
      fillCount,
      correctChoice,
      correctJudge,
      correctFill
    };
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
          
          {/* 版权保护信息 */}
          <div className="px-6 pb-6 text-center text-slate-400 text-xs border-t border-slate-100 pt-4">
            <p>制作：蒋曦</p>
          </div>
        </Card>
      </div>
    );
  }

  // ==================== 详情弹窗 ====================
  if (selectedRecord) {
    const answers = parseAnswers(selectedRecord.answers);
    const stats = getAnswerStats(answers);

    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
          {/* DEC品牌标识条 */}
          <div className="bg-red-700">
            <div className="max-w-5xl mx-auto px-4 py-1.5">
              <div className="flex items-center justify-center gap-3">
                {/* DEC椭圆Logo */}
                <svg width="28" height="17" viewBox="0 0 36 22" className="mr-2">
                  <ellipse cx="18" cy="11" rx="17" ry="10" fill="none" stroke="white" strokeWidth="1.5"/>
                  <text x="18" y="15" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="serif">DEC</text>
                </svg>
                <div className="text-left">
                  <div className="text-xs font-bold text-white leading-tight">东方电气</div>
                  <div className="text-xs text-red-200 leading-tight tracking-wide">DONGFANG ELECTRIC</div>
                </div>
                <div className="h-6 w-px bg-red-500 mx-2"></div>
                <span className="text-xs text-red-100">管理端</span>
              </div>
            </div>
          </div>
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSelectedRecord(null)} className="text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold">考试详情</h1>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
          {/* 基本信息卡片 */}
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* 姓名 */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-500">姓名</span>
                  </div>
                  <p className="text-xl font-bold text-slate-800">{selectedRecord.name}</p>
                </div>

                {/* 公司名称 */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-500">公司名称</span>
                  </div>
                  <p className="text-lg font-semibold text-slate-800 truncate">{selectedRecord.work_type}</p>
                </div>

                {/* 身份证号 */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-500">身份证号</span>
                  </div>
                  <p className="text-lg font-mono font-semibold text-slate-800">{selectedRecord.id_card}</p>
                </div>

                {/* 手机号 */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-500">手机号</span>
                  </div>
                  <p className="text-lg font-semibold text-slate-800">{selectedRecord.phone}</p>
                </div>

                {/* 考试模块 */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-500">考试模块</span>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {getModuleName(selectedRecord.exam_module)}
                  </Badge>
                </div>

                {/* 提交时间 */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-500">提交时间</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{formatDate(selectedRecord.submitted_at)}</p>
                </div>
              </div>

              {/* 成绩 */}
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">考试成绩</p>
                    <div className="flex items-center gap-3">
                      <span className={`text-5xl font-bold ${selectedRecord.score >= 80 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedRecord.score}
                      </span>
                      <span className="text-2xl text-slate-400">分</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {selectedRecord.score >= 80 ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-8 w-8" />
                        <span className="text-2xl font-bold">及格</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="h-8 w-8" />
                        <span className="text-2xl font-bold">不及格</span>
                      </div>
                    )}
                    <p className="text-sm text-slate-500 mt-1">及格分数：80分</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 答题统计 */}
          <Card>
            <CardHeader>
              <CardTitle>答题统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                  <p className="text-sm text-blue-800">总题数</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-green-600">{stats.correct}</p>
                  <p className="text-sm text-green-800">答对题数</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-red-600">{stats.total - stats.correct}</p>
                  <p className="text-sm text-red-800">答错题数</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-purple-600">{stats.accuracy}%</p>
                  <p className="text-sm text-purple-800">正确率</p>
                </div>
              </div>
              
              {/* 分类型统计 */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">选择题</span>
                  </div>
                  <span className="font-semibold">
                    {stats.correctChoice}/{stats.choiceCount}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CircleDot className="h-4 w-4 text-green-600" />
                    <span className="text-sm">判断题</span>
                  </div>
                  <span className="font-semibold">
                    {stats.correctJudge}/{stats.judgeCount}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlignLeft className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">填空题</span>
                  </div>
                  <span className="font-semibold">
                    {stats.correctFill}/{stats.fillCount}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 答题详情 */}
          <Card>
            <CardHeader>
              <CardTitle>答题详情</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-4">
                  <TabsTrigger value="all">全部 ({stats.total})</TabsTrigger>
                  <TabsTrigger value="correct">答对 ({stats.correct})</TabsTrigger>
                  <TabsTrigger value="wrong">答错 ({stats.total - stats.correct})</TabsTrigger>
                  <TabsTrigger value="choice">选择题</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-3">
                  {answers.map((answer, index) => (
                    <QuestionCard key={answer.questionId} answer={answer} index={index + 1} />
                  ))}
                </TabsContent>
                
                <TabsContent value="correct" className="space-y-3">
                  {answers.filter(a => a.isCorrect).map((answer, index) => (
                    <QuestionCard key={answer.questionId} answer={answer} index={answers.filter(a => a.isCorrect).indexOf(answer) + 1} />
                  ))}
                  {answers.filter(a => a.isCorrect).length === 0 && (
                    <p className="text-center text-slate-500 py-8">暂无答对的题目</p>
                  )}
                </TabsContent>
                
                <TabsContent value="wrong" className="space-y-3">
                  {answers.filter(a => !a.isCorrect).map((answer, index) => (
                    <QuestionCard key={answer.questionId} answer={answer} index={answers.filter(a => !a.isCorrect).indexOf(answer) + 1} />
                  ))}
                  {answers.filter(a => !a.isCorrect).length === 0 && (
                    <p className="text-center text-slate-500 py-8">全部答对</p>
                  )}
                </TabsContent>
                
                <TabsContent value="choice" className="space-y-3">
                  {answers.filter(a => a.type === 'choice').map((answer, index) => (
                    <QuestionCard key={answer.questionId} answer={answer} index={answers.filter(a => a.type === 'choice').indexOf(answer) + 1} />
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // ==================== 记录列表页面 ====================
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
        {/* DEC品牌标识条 */}
        <div className="bg-red-700">
          <div className="max-w-6xl mx-auto px-4 py-1.5">
            <div className="flex items-center justify-center gap-3">
              {/* DEC椭圆Logo */}
              <svg width="28" height="17" viewBox="0 0 36 22" className="mr-2">
                <ellipse cx="18" cy="11" rx="17" ry="10" fill="none" stroke="white" strokeWidth="1.5"/>
                <text x="18" y="15" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="serif">DEC</text>
              </svg>
              <div className="text-left">
                <div className="text-xs font-bold text-white leading-tight">东方电气</div>
                <div className="text-xs text-red-200 leading-tight tracking-wide">DONGFANG ELECTRIC</div>
              </div>
              <div className="h-6 w-px bg-red-500 mx-2"></div>
              <span className="text-xs text-red-100">管理端</span>
            </div>
          </div>
        </div>
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
                    <th className="text-left p-4 font-semibold text-slate-600 text-sm hidden lg:table-cell">身份证号</th>
                    <th className="text-left p-4 font-semibold text-slate-600 text-sm hidden xl:table-cell">手机号</th>
                    <th className="text-left p-4 font-semibold text-slate-600 text-sm hidden lg:table-cell">考试模块</th>
                    <th className="text-left p-4 font-semibold text-slate-600 text-sm">成绩</th>
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
                      <td className="p-4 text-sm hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3 w-3 text-slate-400" />
                          <span className="max-w-[150px] truncate" title={record.work_type}>
                            {record.work_type}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-3 w-3 text-slate-400" />
                          <span className="font-mono text-xs" title={record.id_card}>
                            {maskIdCard(record.id_card)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm hidden xl:table-cell">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{maskPhone(record.phone)}</span>
                        </div>
                      </td>
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

        {/* 版权保护信息 */}
        <div className="mt-6 text-center text-slate-400 text-xs">
          <p>制作：蒋曦</p>
        </div>
      </main>
    </div>
  );
}

// 单个题目卡片组件
function QuestionCard({ answer, index }: { answer: DetailedAnswer; index: number }) {
  const typeInfo = getQuestionTypeInfo(answer.type);
  const TypeIcon = typeInfo.icon;
  
  return (
    <div className={`p-4 rounded-lg border ${answer.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${typeInfo.color}`}>
            <TypeIcon className="h-3 w-3" />
            {typeInfo.label}
          </span>
          <span className="text-sm font-semibold text-slate-600">第{index}题</span>
        </div>
        {answer.isCorrect ? (
          <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            正确
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-red-600 text-sm font-medium">
            <XCircle className="h-4 w-4" />
            错误
          </span>
        )}
      </div>
      
      {/* 题目内容 */}
      {answer.question && (
        <div className="mb-3">
          <p className="text-sm font-medium text-slate-700">{answer.question}</p>
        </div>
      )}
      
      {/* 选项（仅选择题显示） */}
      {answer.type === 'choice' && answer.options && (
        <div className="mb-3 space-y-1">
          {answer.options.map((option, idx) => (
            <div 
              key={idx}
              className={`text-sm p-2 rounded ${
                option[0] === answer.correctAnswer?.[0]
                  ? 'bg-green-100 text-green-700 font-medium'
                  : option[0] === answer.userAnswer?.[0] && !answer.isCorrect
                    ? 'bg-red-100 text-red-700'
                    : 'bg-slate-100 text-slate-600'
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
      
      {/* 判断题显示 */}
      {answer.type === 'judge' && (
        <div className="mb-3 flex gap-2">
          <span className={`text-sm p-2 rounded ${
            answer.correctAnswer === '正确' ? 'bg-green-100 text-green-700 font-medium' : 'bg-red-100 text-red-700'
          }`}>
            正确
          </span>
          <span className={`text-sm p-2 rounded ${
            answer.correctAnswer === '错误' ? 'bg-green-100 text-green-700 font-medium' : 'bg-red-100 text-red-700'
          }`}>
            错误
          </span>
        </div>
      )}
      
      {/* 用户答案和正确答案 */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-2 rounded text-sm ${answer.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <span className="text-slate-500">你的答案：</span>
          <span className="font-medium">{answer.userAnswer || '(未作答)'}</span>
        </div>
        {!answer.isCorrect && answer.correctAnswer && (
          <div className="p-2 rounded text-sm bg-green-100 text-green-700">
            <span className="text-slate-500">正确答案：</span>
            <span className="font-medium">{answer.correctAnswer}</span>
          </div>
        )}
      </div>
      
      {/* 解析 */}
      {answer.explanation && (
        <div className="mt-3 p-2 rounded bg-blue-50 text-sm text-blue-700">
          <span className="font-medium">解析：</span>{answer.explanation}
        </div>
      )}
    </div>
  );
}

// 获取题目类型信息
function getQuestionTypeInfo(type: string | null) {
  switch (type) {
    case 'choice':
      return { label: '选择题', icon: CheckSquare, color: 'text-blue-600 bg-blue-50' };
    case 'judge':
      return { label: '判断题', icon: CircleDot, color: 'text-green-600 bg-green-50' };
    case 'fill':
      return { label: '填空题', icon: AlignLeft, color: 'text-purple-600 bg-purple-50' };
    default:
      return { label: '未知', icon: FileText, color: 'text-slate-600 bg-slate-50' };
  }
}
