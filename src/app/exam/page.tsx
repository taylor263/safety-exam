'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, ArrowLeft, ArrowRight, Send, CheckCircle } from 'lucide-react';
import { questions, shuffleArray, type Question } from '@/lib/questions';

type ExamPhase = 'info' | 'exam' | 'camera' | 'submit';

interface UserInfo {
  workType: string;
  name: string;
  idCard: string;
  phone: string;
}

interface Answers {
  [key: string]: string;
}

export default function ExamPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [phase, setPhase] = useState<ExamPhase>('info');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    workType: '',
    name: '',
    idCard: '',
    phone: '',
  });
  
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; score: number } | null>(null);

  // 初始化题目
  useEffect(() => {
    const shuffled = shuffleArray(questions);
    setExamQuestions(shuffled);
  }, []);

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
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('无法访问摄像头:', err);
      alert('无法访问摄像头，请检查权限设置');
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
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPhoto(dataUrl);
      }
    }
  };

  const validateInfo = () => {
    if (!userInfo.workType.trim()) return '请输入工种';
    if (!userInfo.name.trim()) return '请输入姓名';
    if (!userInfo.idCard.trim()) return '请输入身份证号';
    if (!/^\d{17}[\dXx]$/.test(userInfo.idCard)) return '身份证号格式不正确';
    if (!userInfo.phone.trim()) return '请输入电话号码';
    if (!/^1[3-9]\d{9}$/.test(userInfo.phone)) return '电话号码格式不正确';
    return null;
  };

  const handleStartExam = () => {
    const error = validateInfo();
    if (error) {
      alert(error);
      return;
    }
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
    // 检查是否所有题目都已作答
    const unanswered = examQuestions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      alert(`还有 ${unanswered.length} 道题目未作答`);
      return;
    }

    if (!photo) {
      alert('请先拍摄并上传您的做题照片');
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
          ...userInfo,
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
      alert('提交失败，请重试');
      setPhase('camera');
    } finally {
      setIsSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / examQuestions.length) * 100;

  // 渲染信息填写页面
  if (phase === 'info') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <header className="bg-primary text-primary-foreground py-4 shadow">
          <div className="container mx-auto px-4 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="text-primary-foreground hover:bg-primary-foreground/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">个人信息填写</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>请填写您的信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="workType">工种 *</Label>
                <Input
                  id="workType"
                  placeholder="请输入您的工种"
                  value={userInfo.workType}
                  onChange={(e) => setUserInfo({ ...userInfo, workType: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="name">姓名 *</Label>
                <Input
                  id="name"
                  placeholder="请输入您的姓名"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="idCard">身份证号 *</Label>
                <Input
                  id="idCard"
                  placeholder="请输入18位身份证号"
                  value={userInfo.idCard}
                  onChange={(e) => setUserInfo({ ...userInfo, idCard: e.target.value })}
                  maxLength={18}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">电话号码 *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="请输入11位手机号"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  maxLength={11}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleStartExam} className="w-full mt-6">
                开始考试
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // 渲染提交成功页面
  if (phase === 'submit' && submitResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center p-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">提交成功！</h2>
          <p className="text-slate-600 mb-4">您的考试已成功提交</p>
          <div className="bg-slate-100 rounded-lg p-6 mb-6">
            <div className="text-4xl font-bold text-primary">{submitResult.score}分</div>
            <p className="text-slate-500 text-sm mt-1">您的考试成绩</p>
          </div>
          <div className="text-sm text-slate-500 mb-6">
            <p>姓名：{userInfo.name}</p>
            <p>工种：{userInfo.workType}</p>
          </div>
          <Button onClick={() => router.push('/')} className="w-full">
            返回首页
          </Button>
        </Card>
      </div>
    );
  }

  // 渲染提交中页面
  if (phase === 'submit' && isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center p-8">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold">正在提交...</h2>
          <p className="text-slate-500 mt-2">请勿关闭页面</p>
        </Card>
      </div>
    );
  }

  // 渲染拍照页面
  if (phase === 'camera') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <header className="bg-primary text-primary-foreground py-4 shadow">
          <div className="container mx-auto px-4 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setPhase('exam')} className="text-primary-foreground hover:bg-primary-foreground/20">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">拍摄答题照片</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                请拍摄您的答题照片
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded text-sm">
                <p className="text-amber-800">请确保照片清晰显示：</p>
                <ul className="list-disc list-inside text-amber-700 mt-2">
                  <li>您本人的面部</li>
                  <li>考试设备/界面</li>
                </ul>
              </div>

              {photo ? (
                <div className="space-y-4">
                  <img src={photo} alt="答题照片" className="w-full rounded-lg" />
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setPhoto(null)} className="flex-1">
                      重新拍摄
                    </Button>
                    <Button onClick={handleSubmit} className="flex-1" disabled={isSubmitting}>
                      <Send className="h-4 w-4 mr-2" />
                      确认提交
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
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
                  <Button onClick={takePhoto} className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    拍照
                  </Button>
                </div>
              )}

              <div className="text-center text-sm text-slate-500">
                <p>已作答：{answeredCount} / {examQuestions.length} 题</p>
                {answeredCount < examQuestions.length && (
                  <Button variant="link" onClick={() => setPhase('exam')} className="text-primary">
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

  // 渲染答题页面
  const currentQuestion = examQuestions[currentIndex];
  const questionTypeLabel = currentQuestion.type === 'choice' ? '选择题' : currentQuestion.type === 'judge' ? '判断题' : '填空题';
  const questionScore = currentQuestion.type === 'choice' ? '5分' : currentQuestion.type === 'judge' ? '3分' : '6分';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-primary text-primary-foreground py-4 shadow">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm">答题进度：{currentIndex + 1}/{examQuestions.length}</span>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setPhase('camera')}>
              <Upload className="h-4 w-4 mr-2" />
              上传照片
            </Button>
          </div>
          <Progress value={progress} className="mt-2 h-2" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                第{currentIndex + 1}题
                <span className="ml-2 text-sm font-normal text-slate-500">
                  【{questionTypeLabel}，{questionScore}】
                </span>
              </CardTitle>
              <span className="text-xs bg-slate-200 px-2 py-1 rounded">
                {currentQuestion.category}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg font-medium">{currentQuestion.question}</p>

            {/* 选择题 */}
            {currentQuestion.type === 'choice' && currentQuestion.options && (
              <RadioGroup
                value={answers[currentQuestion.id] || ''}
                onValueChange={(value) => setAnswers({ ...answers, [currentQuestion.id]: value })}
                className="space-y-3"
              >
                {currentQuestion.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-slate-50">
                    <RadioGroupItem value={option[0]} id={option} />
                    <Label htmlFor={option} className="flex-1 cursor-pointer">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {/* 判断题 */}
            {currentQuestion.type === 'judge' && (
              <RadioGroup
                value={answers[currentQuestion.id] || ''}
                onValueChange={(value) => setAnswers({ ...answers, [currentQuestion.id]: value })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-slate-50">
                  <RadioGroupItem value="正确" id="judge-correct" />
                  <Label htmlFor="judge-correct" className="cursor-pointer">正确</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-slate-50">
                  <RadioGroupItem value="错误" id="judge-wrong" />
                  <Label htmlFor="judge-wrong" className="cursor-pointer">错误</Label>
                </div>
              </RadioGroup>
            )}

            {/* 填空题 */}
            {currentQuestion.type === 'fill' && (
              <div>
                <Input
                  placeholder="请在此输入答案"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                  className="text-lg"
                />
              </div>
            )}

            {/* 导航按钮 */}
            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                上一题
              </Button>

              {currentIndex === examQuestions.length - 1 ? (
                <Button
                  onClick={() => setPhase('camera')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  完成答题
                  <Upload className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                >
                  下一题
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>

            {/* 快速跳转 */}
            <div className="pt-4 border-t">
              <p className="text-sm text-slate-500 mb-2">快速跳转：</p>
              <div className="flex flex-wrap gap-2">
                {examQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-8 h-8 text-xs rounded ${
                      answers[q.id] 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-slate-200 hover:bg-slate-300'
                    } ${idx === currentIndex ? 'ring-2 ring-primary ring-offset-2' : ''}`}
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
