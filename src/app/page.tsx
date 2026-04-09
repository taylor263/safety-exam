'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, FileText, Users, Zap, Smartphone } from 'lucide-react';
import { workTypes, type WorkType } from '@/lib/questions';

export default function HomePage() {
  const router = useRouter();

  const handleStartExam = (module: WorkType) => {
    router.push(`/exam?module=${module}`);
  };

  const getIcon = (icon: 'shield' | 'users' | 'zap', className: string) => {
    switch (icon) {
      case 'shield':
        return <Shield className={className} />;
      case 'users':
        return <Users className={className} />;
      case 'zap':
        return <Zap className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 头部 */}
      <header className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
        {/* DEC品牌标识条 */}
        <div className="bg-red-700">
          <div className="max-w-4xl mx-auto px-4 py-2">
            <div className="flex items-center justify-center gap-4">
              {/* DEC椭圆Logo */}
              <div className="flex items-center">
                <svg width="36" height="22" viewBox="0 0 36 22" className="mr-2">
                  <ellipse cx="18" cy="11" rx="17" ry="10" fill="none" stroke="white" strokeWidth="1.5"/>
                  <text x="18" y="15" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="serif">DEC</text>
                </svg>
                <div className="text-left">
                  <div className="text-sm font-bold text-white leading-tight">东方电气</div>
                  <div className="text-xs text-red-200 leading-tight tracking-wide">DONGFANG ELECTRIC</div>
                </div>
              </div>
              <div className="h-8 w-px bg-red-500"></div>
              <span className="text-xs text-red-100">安全生产培训</span>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="h-8 w-8" />
            <h1 className="text-xl font-bold">东方电气精细电子材料有限公司</h1>
          </div>
          <p className="text-white/90 font-medium">安全生产培训考核系统</p>
          <p className="text-white/70 text-sm mt-1">特殊作业安全常识在线考试</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 手机端提示 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Smartphone className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-blue-800">手机端已优化</p>
            <p className="text-sm text-blue-600">支持手机答题、拍照上传，方便现场使用</p>
          </div>
        </div>

        {/* 考试须知 */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-600" />
              考试须知
            </h2>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r mb-4">
              <h3 className="font-semibold text-amber-800 mb-2">重要提醒</h3>
              <ul className="list-disc list-inside text-amber-700 space-y-1 text-sm">
                <li>请选择您对应的作业类型进行考试</li>
                <li>考试全程需要拍摄您答题时的照片作为凭证</li>
                <li>提交前必须上传正在做题的照片</li>
              </ul>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">10</div>
                <div className="text-sm text-blue-800">选择题</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">10</div>
                <div className="text-sm text-green-800">判断题</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">5</div>
                <div className="text-sm text-purple-800">填空题</div>
              </div>
            </div>

            <div className="mt-4 text-center text-slate-600 text-sm">
              <p>总分 100 分，及格分数 80 分</p>
            </div>
          </CardContent>
        </Card>

        {/* 选择考试模块 */}
        <h2 className="text-xl font-bold text-slate-800 mb-4">请选择考试模块</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {workTypes.map((wt) => (
            <Card 
              key={wt.id}
              className={`hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-300 overflow-hidden`}
              onClick={() => handleStartExam(wt.id)}
            >
              <div className={`h-2 ${wt.bgColor.replace('100', '500')}`}></div>
              <CardContent className="p-6">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${wt.bgColor}`}>
                  {getIcon(wt.icon, `h-7 w-7 ${wt.color}`)}
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">{wt.name}</h3>
                <CardDescription className="mb-4 text-sm">{wt.description}</CardDescription>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    {wt.questionCount.choice}选择题
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    {wt.questionCount.judge}判断题
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    {wt.questionCount.fill}填空题
                  </span>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">开始考试</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 管理端入口 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">管理端</h3>
                <p className="text-slate-500 text-sm">查看考试成绩与考试记录</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push('/admin')}>
              进入管理
            </Button>
          </CardContent>
        </Card>

        {/* 底部说明 */}
        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>请确保在安静、光线充足的环境中进行考试</p>
        </div>

        {/* 版权保护信息 */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="bg-slate-100 rounded-xl p-6 text-center">
            {/* DEC品牌标识 */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <svg width="48" height="30" viewBox="0 0 36 22" className="scale-125">
                <ellipse cx="18" cy="11" rx="17" ry="10" fill="none" stroke="#1f2937" strokeWidth="1.5"/>
                <text x="18" y="15" textAnchor="middle" fill="#1f2937" fontSize="10" fontWeight="bold" fontFamily="serif">DEC</text>
              </svg>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-800 leading-tight">东方电气</div>
                <div className="text-xs text-slate-500 leading-tight tracking-wide">DONGFANG ELECTRIC</div>
              </div>
            </div>
            
            {/* 版权声明 */}
            <div className="space-y-2 text-slate-600">
              <p className="text-xs">© {new Date().getFullYear()} 东方电气精细电子材料有限公司</p>
              <p className="text-xs text-slate-400">
                版权所有 · 保留一切权利
              </p>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  本系统由 <span className="font-semibold text-slate-700">蒋曦</span> 精心制作
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  严禁未经授权的复制、传播或商业使用
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
