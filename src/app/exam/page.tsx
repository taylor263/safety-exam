'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, ArrowLeft, ArrowRight, Send, CheckCircle, Smartphone, Shield, Users, Zap } from 'lucide-react';
import { getQuestionsByWorkType, workTypes, shuffleArray, type Question, type WorkType } from '@/lib/questions';

type ExamPhase = 'select' | 'info' | 'exam' | 'camera' | 'submit';

interface UserInfo {
  companyName: string;
  name: string;
  idCard: string;
  phone: string;
  examModule: WorkType;
}

// DEC 东方电气标识 Header 组件
function DecHeader({ title, subtitle, onBack, showBack = true, sticky = false }: { 
  title: string; 
  subtitle?: string; 
  onBack?: () => void;
  showBack?: boolean;
  sticky?: boolean;
}) {
  const HeaderContent = () => (
    <>
      {/* DEC标识条 */}
      <div className="bg-red-700">
        <div className={`mx-auto px-4 py-1.5 flex items-center justify-between ${sticky ? 'max-w-2xl' : 'max-w-4xl'}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-red-600 font-bold text-sm">DEC</span>
            </div>
            <span className="text-xs text-red-100">东方电气精细电子材料</span>
          </div>
          <span className="text-xs text-red-200">安全管理</span>
        </div>
      </div>
      {/* 标题栏 */}
      <div className={`px-4 py-4 ${sticky ? 'max-w-2xl mx-auto' : 'max-w-4xl mx-auto'}`}>
        <div className="flex items-center gap-3">
          {showBack && onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20 -ml-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <div>
              <h1 className="text-lg font-bold">{title}</h1>
              {subtitle && <p className="text-xs text-white/70">{subtitle}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (sticky) {
    return (
      <header className="bg-gradient-to-r from-red-600 to-orange-500 text-white sticky top-0 z-10">
        <HeaderContent />
      </header>
    );
  }

  return (
    <header className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
      <HeaderContent />
    </header>
  );
}

interface Answers {
  [key: string]: string;
}

function ExamContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [phase, setPhase] = useState<ExamPhase>('select');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    companyName: '',
    name: '',
    idCard: '',
    phone: '',
    examModule: (searchParams.get('module') as WorkType) || 'confined_space',
  });
  
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; score: number } | null>(null);
  const [cameraError, setCameraError] = useState('');

  // 启动摄像头
  useEffect(() => {
    if (phase === 'camera' && videoRef.current) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [phase]);

  const startCamera = async () => {
    try {
      setCameraError('');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraError('无法访问摄像头，请使用相册上传');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPhoto(dataUrl);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectModule = (module: WorkType) => {
    setUserInfo({ ...userInfo, examModule: module });
    setPhase('info');
  };

  const validateInfo = () => {
    if (!userInfo.companyName.trim()) return '请输入公司名称';
    if (!userInfo.name.trim()) return '请输入姓名';
    if (!userInfo.idCard.trim()) return '请输入身份证号';
    if (!/^\d{17}[\dXx]$/.test(userInfo.idCard)) return '身份证号格式不正确（18位）';
    if (!userInfo.phone.trim()) return '请输入电话号码';
    if (!/^1[3-9]\d{9}$/.test(userInfo.phone)) return '电话号码格式不正确（11位手机号）';
    return null;
  };

  const handleStartExam = () => {
    const error = validateInfo();
    if (error) {
      alert(error);
      return;
    }
    const questions = getQuestionsByWorkType(userInfo.examModule);
    setExamQuestions(shuffleArray(questions));
    setPhase('exam');
  };

  const calculateScore = (): number => {
    let score = 0;
    examQuestions.forEach(q => {
      const userAnswer = answers[q.id]?.trim().toLowerCase();
      const correctAnswer = q.answer.trim().toLowerCase();
      if (userAnswer === correctAnswer) {
        if (q.type === 'choice') score += 5;
        else if (q.type === 'judge') score += 3;
        else if (q.type === 'fill') score += 6;
      }
    });
    return score;
  };

  const handleSubmit = async () => {
    const unanswered = examQuestions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      alert(`还有 ${unanswered.length} 道题目未作答`);
      return;
    }

    if (!photo) {
      alert('请先拍摄或上传您的做题照片');
      setPhase('camera');
      return;
    }

    setIsSubmitting(true);
    setPhase('submit');

    try {
      const score = calculateScore();
      const response = await fetch('/api/exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: userInfo.companyName,
          name: userInfo.name,
          idCard: userInfo.idCard,
          phone: userInfo.phone,
          examModule: userInfo.examModule,
          photo,
          answers,
          score,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitResult({ success: true, score });
      } else {
        alert(result.error || '提交失败');
        setPhase('camera');
      }
    } catch {
      alert('提交失败，请检查网络后重试');
      setPhase('camera');
    } finally {
      setIsSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const progress = examQuestions.length > 0 ? (answeredCount / examQuestions.length) * 100 : 0;
  const currentModule = workTypes.find(wt => wt.id === userInfo.examModule);

  // ==================== 模块选择页面 ====================
  if (phase === 'select') {
    const getIcon = (icon: 'shield' | 'users' | 'zap', className: string) => {
      switch (icon) {
        case 'shield': return <Shield className={className} />;
        case 'users': return <Users className={className} />;
        case 'zap': return <Zap className={className} />;
      }
    };

    return (
      <div className="min-h-screen bg-slate-50">
        <DecHeader 
          title="安全生产培训考核" 
          subtitle="请选择考试模块" 
          onBack={() => router.push('/')} 
        />

        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-blue-800">手机端已优化</p>
              <p className="text-sm text-blue-600">支持手机答题、拍照上传</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workTypes.map((wt) => (
              <Card 
                key={wt.id}
                className={`cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-300 overflow-hidden`}
                onClick={() => handleSelectModule(wt.id)}
              >
                <div className={`h-1 ${wt.bgColor.replace('100', '500')}`}></div>
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${wt.bgColor}`}>
                    {getIcon(wt.icon, `h-7 w-7 ${wt.color}`)}
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2">{wt.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">{wt.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{wt.questionCount.choice}选择题</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{wt.questionCount.judge}判断题</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{wt.questionCount.fill}填空题</span>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">选择</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // ==================== 信息填写页面 ====================
  if (phase === 'info') {
    return (
      <div className="min-h-screen bg-slate-50">
        <DecHeader 
          title="个人信息填写" 
          subtitle={`考试模块：${currentModule?.name}`}
          onBack={() => setPhase('select')} 
        />

        <main className="max-w-md mx-auto px-4 py-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-center text-xl">请填写个人信息</CardTitle>
              <p className="text-center text-slate-500 text-sm">带 * 号为必填项</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">公司名称 *</label>
                <Input
                  placeholder="请输入您的公司名称"
                  value={userInfo.companyName}
                  onChange={(e) => setUserInfo({ ...userInfo, companyName: e.target.value })}
                  className="mt-1 h-12"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">姓名 *</label>
                <Input
                  placeholder="请输入您的真实姓名"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  className="mt-1 h-12"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">身份证号 *</label>
                <Input
                  placeholder="18位身份证号"
                  value={userInfo.idCard}
                  onChange={(e) => setUserInfo({ ...userInfo, idCard: e.target.value })}
                  maxLength={18}
                  className="mt-1 h-12 font-mono"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">手机号 *</label>
                <Input
                  type="tel"
                  placeholder="11位手机号码"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  maxLength={11}
                  className="mt-1 h-12"
                />
              </div>
              <Button onClick={handleStartExam} className="w-full h-12 mt-4 bg-blue-600 hover:bg-blue-700 text-base font-medium">
                开始考试
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // ==================== 提交成功页面 ====================
  if (phase === 'submit' && submitResult) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-sm w-full text-center shadow-lg">
          <CardContent className="pt-8 pb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">提交成功！</h2>
            <p className="text-slate-500 mb-4">您的考试已成功提交</p>
            <div className="bg-slate-100 rounded-xl p-6 mb-6">
              <div className="text-5xl font-bold text-blue-600">{submitResult.score}分</div>
              <p className="text-slate-500 text-sm mt-1">您的考试成绩</p>
            </div>
            <div className="text-sm text-slate-500 mb-6 space-y-1">
              <p>姓名：{userInfo.name}</p>
              <p>公司：{userInfo.companyName}</p>
              <p>模块：{currentModule?.name}</p>
            </div>
            <Button onClick={() => router.push('/')} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
              返回首页
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ==================== 提交中页面 ====================
  if (phase === 'submit' && isSubmitting) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-sm mx-auto text-center p-8">
          <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold">正在提交...</h2>
          <p className="text-slate-500 mt-2">请勿关闭页面</p>
        </Card>
      </div>
    );
  }

  // ==================== 拍照页面 ====================
  if (phase === 'camera') {
    return (
      <div className="min-h-screen bg-slate-50">
        <DecHeader 
          title="上传答题凭证" 
          onBack={() => setPhase('exam')} 
        />

        <main className="max-w-lg mx-auto px-4 py-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Camera className="h-5 w-5" />
                请拍摄您的答题照片
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded text-sm">
                <p className="text-amber-800 font-medium">请确保照片清晰显示：</p>
                <ul className="list-disc list-inside text-amber-700 mt-1">
                  <li>您本人的面部</li>
                  <li>考试设备/界面</li>
                </ul>
              </div>

              {photo ? (
                <div className="space-y-4">
                  <img src={photo} alt="答题照片" className="w-full rounded-lg border" />
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setPhoto(null)} className="flex-1 h-12">
                      重新拍摄
                    </Button>
                    <Button onClick={handleSubmit} className="flex-1 h-12 bg-green-600 hover:bg-green-700">
                      <Send className="h-4 w-4 mr-2" />
                      确认提交
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {cameraError && (
                    <div className="bg-red-50 border border-red-300 p-3 rounded text-sm text-red-700">
                      {cameraError}
                    </div>
                  )}
                  
                  <div className="bg-slate-100 rounded-lg overflow-hidden">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full" />
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                  
                  <Button onClick={takePhoto} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                    <Camera className="h-5 w-5 mr-2" />
                    拍照
                  </Button>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-300"></div>
                    <span className="text-sm text-slate-500">或</span>
                    <div className="flex-1 h-px bg-slate-300"></div>
                  </div>

                  <input type="file" accept="image/*" capture="user" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full h-12">
                    <Upload className="h-4 w-4 mr-2" />
                    从相册选择
                  </Button>
                </div>
              )}

              <div className="text-center text-sm text-slate-500 pt-2">
                <p>已作答：{answeredCount} / {examQuestions.length} 题</p>
                {answeredCount < examQuestions.length && (
                  <Button variant="link" onClick={() => setPhase('exam')} className="text-blue-600">
                    继续答题
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* 版权保护信息 */}
          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg width="24" height="15" viewBox="0 0 36 22">
                <ellipse cx="18" cy="11" rx="17" ry="10" fill="none" stroke="#64748b" strokeWidth="1"/>
                <text x="18" y="15" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="bold" fontFamily="serif">DEC</text>
              </svg>
              <span className="text-xs text-slate-400">东方电气</span>
            </div>
            <p className="text-xs text-slate-400">© {new Date().getFullYear()} 东方电气精细电子材料有限公司</p>
            <p className="text-xs text-slate-300 mt-1">本系统由 <span className="text-slate-400">蒋曦</span> 制作</p>
          </div>
        </main>
      </div>
    );
  }

  // ==================== 答题页面 ====================
  if (examQuestions.length === 0) return null;

  const currentQuestion = examQuestions[currentIndex];
  const questionTypeLabel = currentQuestion.type === 'choice' ? '选择题' : currentQuestion.type === 'judge' ? '判断题' : '填空题';
  const questionScore = currentQuestion.type === 'choice' ? '5分' : currentQuestion.type === 'judge' ? '3分' : '6分';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 答题页面专用Header */}
      <header className="bg-gradient-to-r from-red-600 to-orange-500 text-white sticky top-0 z-10">
        {/* DEC品牌标识条 */}
        <div className="bg-red-700">
          <div className="max-w-2xl mx-auto px-4 py-1.5">
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
            </div>
          </div>
        </div>
        {/* 进度条 */}
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">答题 {currentIndex + 1}/{examQuestions.length}</span>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => setPhase('camera')}
              className="bg-white/20 text-white hover:bg-white/30 border-0 text-xs"
            >
              <Camera className="h-3 w-3 mr-1" />
              上传照片
            </Button>
          </div>
          <Progress value={progress} className="h-1.5 bg-white/30" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg">
                第{currentIndex + 1}题
                <span className="ml-2 text-sm font-normal text-slate-500">
                  【{questionTypeLabel}，{questionScore}】
                </span>
              </CardTitle>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                {currentQuestion.category}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-lg font-medium leading-relaxed">{currentQuestion.question}</p>

            {/* 选择题 */}
            {currentQuestion.type === 'choice' && currentQuestion.options && (
              <div className="space-y-2">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setAnswers({ ...answers, [currentQuestion.id]: option[0] })}
                    className={`w-full p-4 rounded-xl border-2 text-left text-base transition-all ${
                      answers[currentQuestion.id] === option[0]
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {/* 判断题 */}
            {currentQuestion.type === 'judge' && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAnswers({ ...answers, [currentQuestion.id]: '正确' })}
                  className={`p-6 rounded-xl border-2 text-center text-lg transition-all ${
                    answers[currentQuestion.id] === '正确'
                      ? 'border-green-500 bg-green-50 text-green-700 font-bold'
                      : 'border-slate-200 hover:border-green-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">✓</span>
                  正确
                </button>
                <button
                  onClick={() => setAnswers({ ...answers, [currentQuestion.id]: '错误' })}
                  className={`p-6 rounded-xl border-2 text-center text-lg transition-all ${
                    answers[currentQuestion.id] === '错误'
                      ? 'border-red-500 bg-red-50 text-red-700 font-bold'
                      : 'border-slate-200 hover:border-red-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">✗</span>
                  错误
                </button>
              </div>
            )}

            {/* 填空题 */}
            {currentQuestion.type === 'fill' && (
              <Input
                placeholder="请在此输入答案"
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                className="text-lg h-12"
              />
            )}

            {/* 导航按钮 */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="flex-1 h-12"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                上一题
              </Button>

              {currentIndex === examQuestions.length - 1 ? (
                <Button
                  onClick={() => setPhase('camera')}
                  className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                >
                  完成答题
                  <Upload className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  className="flex-1 h-12"
                >
                  下一题
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>

            {/* 快速跳转 */}
            <div className="pt-4 border-t">
              <p className="text-sm text-slate-500 mb-2">快速跳转：</p>
              <div className="grid grid-cols-10 gap-1">
                {examQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`aspect-square text-xs rounded flex items-center justify-center font-medium transition-all ${
                      answers[q.id] 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    } ${idx === currentIndex ? 'ring-2 ring-yellow-400 ring-offset-1' : ''}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function ExamLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Card className="max-w-sm mx-auto text-center p-8">
        <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <h2 className="text-xl font-bold">加载中...</h2>
        <p className="text-slate-500 mt-2">请稍候</p>
      </Card>
    </div>
  );
}

export default function ExamPage() {
  return (
    <Suspense fallback={<ExamLoading />}>
      <ExamContent />
    </Suspense>
  );
}
