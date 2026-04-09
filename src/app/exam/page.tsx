'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, ArrowLeft, ArrowRight, Send, CheckCircle, Smartphone, Users, Briefcase, Zap, ShieldCheck } from 'lucide-react';
import { getQuestionsByWorkType, workTypes, shuffleArray, type Question, type WorkType } from '@/lib/questions';

type ExamPhase = 'select' | 'info' | 'exam' | 'camera' | 'submit';

interface UserInfo {
  companyName: string;
  name: string;
  idCard: string;
  phone: string;
  examModule: WorkType;
}

interface Answers {
  [key: string]: string;
}

export default function ExamPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [phase, setPhase] = useState<ExamPhase>('select');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    companyName: '',
    name: '',
    idCard: '',
    phone: '',
    examModule: 'confined_space',
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
    } catch (err) {
      console.error('无法访问摄像头:', err);
      setCameraError('无法访问摄像头，请允许摄像头权限或使用相册上传');
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
    // 加载对应模块的题目
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
    } catch (err) {
      console.error('提交失败:', err);
      alert('提交失败，请检查网络后重试');
      setPhase('camera');
    } finally {
      setIsSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const progress = examQuestions.length > 0 ? (answeredCount / examQuestions.length) * 100 : 0;

  // ==================== 模块选择页面 ====================
  if (phase === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100">
        <header className="bg-blue-600 text-white py-4 px-4 shadow-lg sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold">安全生产培训考核</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-4 flex items-center gap-2 text-blue-800 text-sm">
            <Smartphone className="h-4 w-4 flex-shrink-0" />
            <span>本系统已针对手机端优化，请放心使用</span>
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-4 text-center">请选择考试模块</h2>

          <div className="space-y-4">
            {workTypes.map((wt) => (
              <Card 
                key={wt.id} 
                className="cursor-pointer hover:shadow-lg transition-all hover:border-blue-400"
                onClick={() => handleSelectModule(wt.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      wt.id === 'confined_space' ? 'bg-purple-100' :
                      wt.id === 'lifting' ? 'bg-orange-100' : 'bg-red-100'
                    }`}>
                      {wt.id === 'confined_space' ? (
                        <ShieldCheck className={`h-7 w-7 text-purple-600`} />
                      ) : wt.id === 'lifting' ? (
                        <Users className={`h-7 w-7 text-orange-600`} />
                      ) : (
                        <Zap className={`h-7 w-7 text-red-600`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-800">{wt.name}</h3>
                      <p className="text-slate-500 text-sm mt-1">{wt.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          {wt.questionCount.choice}道选择题
                        </span>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          {wt.questionCount.judge}道判断题
                        </span>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          {wt.questionCount.fill}道填空题
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 self-center" />
                  </div>
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
    const currentModule = workTypes.find(wt => wt.id === userInfo.examModule);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100">
        <header className="bg-blue-600 text-white py-4 px-4 shadow-lg sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setPhase('select')} className="text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">个人信息填写</h1>
              <p className="text-xs text-blue-200">正在参加：{currentModule?.name}</p>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-center">请填写个人信息</CardTitle>
              <p className="text-center text-slate-500 text-sm mt-1">带 * 号为必填项</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="companyName" className="text-base font-medium">公司名称 *</label>
                <Input
                  id="companyName"
                  placeholder="请输入您的公司名称"
                  value={userInfo.companyName}
                  onChange={(e) => setUserInfo({ ...userInfo, companyName: e.target.value })}
                  className="mt-2 h-12 text-base"
                />
              </div>
              <div>
                <label htmlFor="name" className="text-base font-medium">姓名 *</label>
                <Input
                  id="name"
                  placeholder="请输入您的真实姓名"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  className="mt-2 h-12 text-base"
                />
              </div>
              <div>
                <label htmlFor="idCard" className="text-base font-medium">身份证号 *</label>
                <Input
                  id="idCard"
                  placeholder="18位身份证号"
                  value={userInfo.idCard}
                  onChange={(e) => setUserInfo({ ...userInfo, idCard: e.target.value })}
                  maxLength={18}
                  className="mt-2 h-12 text-base font-mono"
                  inputMode="numeric"
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-base font-medium">手机号 *</label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="11位手机号码"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  maxLength={11}
                  className="mt-2 h-12 text-base"
                  inputMode="tel"
                />
              </div>
              <Button onClick={handleStartExam} className="w-full h-14 text-lg mt-6 bg-blue-600 hover:bg-blue-700">
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
    const currentModule = workTypes.find(wt => wt.id === userInfo.examModule);
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="max-w-sm w-full text-center p-6 shadow-xl">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">提交成功！</h2>
          <p className="text-slate-600 mb-4">您的考试已成功提交</p>
          <div className="bg-slate-100 rounded-xl p-6 mb-6">
            <div className="text-5xl font-bold text-blue-600">{submitResult.score}分</div>
            <p className="text-slate-500 text-sm mt-1">您的考试成绩</p>
          </div>
          <div className="text-sm text-slate-500 mb-6 space-y-1">
            <p>姓名：{userInfo.name}</p>
            <p>公司：{userInfo.companyName}</p>
            <p>模块：{currentModule?.name}</p>
          </div>
          <Button onClick={() => router.push('/')} className="w-full h-12 text-lg">
            返回首页
          </Button>
        </Card>
      </div>
    );
  }

  // ==================== 提交中页面 ====================
  if (phase === 'submit' && isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <header className="bg-blue-600 text-white py-4 px-4 shadow-lg sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setPhase('exam')} className="text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold">上传答题凭证</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Camera className="h-5 w-5" />
                请拍摄您的答题照片
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded text-sm">
                <p className="text-amber-800 font-medium">请确保照片清晰显示：</p>
                <ul className="list-disc list-inside text-amber-700 mt-1 space-y-0.5">
                  <li>您本人的面部</li>
                  <li>考试设备/界面</li>
                </ul>
              </div>

              {photo ? (
                <div className="space-y-4">
                  <img src={photo} alt="答题照片" className="w-full rounded-lg border-2 border-slate-200" />
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setPhoto(null)} className="flex-1 h-12 text-base">
                      重新拍摄
                    </Button>
                    <Button onClick={handleSubmit} className="flex-1 h-12 text-base bg-green-600 hover:bg-green-700">
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
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full"
                    />
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                  
                  <Button onClick={takePhoto} className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700">
                    <Camera className="h-5 w-5 mr-2" />
                    拍照
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-slate-500">或</span>
                    </div>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-12 text-base"
                  >
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
        </main>
      </div>
    );
  }

  // ==================== 答题页面 ====================
  if (examQuestions.length === 0) {
    return null;
  }

  const currentQuestion = examQuestions[currentIndex];
  const questionTypeLabel = currentQuestion.type === 'choice' ? '选择题' : currentQuestion.type === 'judge' ? '判断题' : '填空题';
  const questionScore = currentQuestion.type === 'choice' ? '5分' : currentQuestion.type === 'judge' ? '3分' : '6分';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-blue-600 text-white py-3 px-4 shadow-lg sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">答题 {currentIndex + 1}/{examQuestions.length}</span>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setPhase('camera')}
            className="bg-white/20 text-white hover:bg-white/30 border-0"
          >
            <Camera className="h-4 w-4 mr-1" />
            上传照片
          </Button>
        </div>
        <Progress value={progress} className="mt-2 h-2 bg-white/30" />
      </header>

      <main className="container mx-auto px-4 py-4">
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg">
                第{currentIndex + 1}题
                <span className="ml-2 text-sm font-normal text-slate-500">
                  【{questionTypeLabel}，{questionScore}】
                </span>
              </CardTitle>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap">
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
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
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
                      : 'border-slate-200 hover:border-green-300 hover:bg-slate-50'
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
                      : 'border-slate-200 hover:border-red-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-2xl block mb-1">✗</span>
                  错误
                </button>
              </div>
            )}

            {/* 填空题 */}
            {currentQuestion.type === 'fill' && (
              <div>
                <Input
                  placeholder="请在此输入答案"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                  className="text-lg h-14"
                />
              </div>
            )}

            {/* 导航按钮 */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="flex-1 h-12 text-base"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                上一题
              </Button>

              {currentIndex === examQuestions.length - 1 ? (
                <Button
                  onClick={() => setPhase('camera')}
                  className="flex-1 h-12 text-base bg-green-600 hover:bg-green-700"
                >
                  完成答题
                  <Upload className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  className="flex-1 h-12 text-base"
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
