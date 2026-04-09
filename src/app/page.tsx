'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, FileText, Users } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* 头部 */}
      <header className="bg-primary text-primary-foreground py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-8 w-8" />
            <h1 className="text-2xl font-bold">安全生产培训考核系统</h1>
          </div>
          <p className="text-center mt-2 text-primary-foreground/80">
            八大特殊作业与非常规作业安全常识考试
          </p>
        </div>
      </header>

      {/* 考试说明 */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 考试须知 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                考试须知
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <h3 className="font-semibold text-amber-800 mb-2">重要提醒</h3>
                <ul className="list-disc list-inside text-amber-700 space-y-1 text-sm">
                  <li>考试全程需要开启摄像头，录制您答题时的画面</li>
                  <li>提交前必须拍摄并上传您正在做题的照片</li>
                  <li>照片需清晰显示您本人和考试界面</li>
                  <li>照片将作为考试凭证留存</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600">10</div>
                  <div className="text-blue-800 text-sm">选择题</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-600">10</div>
                  <div className="text-green-800 text-sm">判断题</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-600">5</div>
                  <div className="text-purple-800 text-sm">填空题</div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-2">考试内容</h3>
                <p className="text-slate-600 text-sm">
                  本考试涵盖八大特殊作业（动火作业、受限空间作业、盲板抽堵作业、高处作业、
                  吊装作业、临时用电作业、破土作业、断路作业）及非常规作业的安全常识。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 按钮区 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/exam')}>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">开始考试</h3>
                <p className="text-slate-500 text-sm text-center">
                  填写个人信息后开始答题
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin')}>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">管理端</h3>
                <p className="text-slate-500 text-sm text-center">
                  查看考试成绩与学员信息
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 底部说明 */}
          <div className="mt-8 text-center text-slate-400 text-sm">
            <p>请确保在安静、光线充足的环境中进行考试</p>
            <p>考试过程中请保持摄像头开启</p>
          </div>
        </div>
      </main>
    </div>
  );
}
