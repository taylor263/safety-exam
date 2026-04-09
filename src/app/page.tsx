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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* 头部 */}
      <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white shadow-lg">
        {/* DEC品牌标识条 - 蓝色主题，左上角DEC */}
        <div className="bg-blue-800/50">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              {/* DEC椭圆Logo */}
              <svg width="40" height="24" viewBox="0 0 36 22">
                <ellipse cx="18" cy="11" rx="17" ry="10" fill="none" stroke="white" strokeWidth="1.5"/>
                <text x="18" y="15" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">DEC</text>
              </svg>
              <div className="text-left">
                <div className="text-sm font-bold text-white leading-tight">东方电气</div>
                <div className="text-xs text-blue-200 leading-tight tracking-wide">DONGFANG ELECTRIC</div>
              </div>
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
        {/* 手机端提示 - 渐变卡片 */}
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md">
            <Smartphone className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-blue-800">手机端已优化</p>
            <p className="text-sm text-blue-600">支持手机答题、拍照上传，方便现场使用</p>
          </div>
        </div>

        {/* 考试须知 */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              考试须知
            </h2>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-4 rounded-r mb-4">
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
              className={`hover:shadow-xl transition-all cursor-pointer border-0 overflow-hidden bg-white/80 backdrop-blur-sm hover:scale-[1.02]`}
              onClick={() => handleStartExam(wt.id)}
            >
              <div className={`h-2 bg-gradient-to-r ${wt.bgColor.replace('100', '400').replace('bg-', 'from-').replace('-100', '-400')} to-${wt.color.split('-')[1]}-300`}></div>
              <CardContent className="p-6">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${wt.bgColor} shadow-lg`}>
                  {getIcon(wt.icon, `h-7 w-7 ${wt.color}`)}
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">{wt.name}</h3>
                <CardDescription className="mb-4 text-sm">{wt.description}</CardDescription>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 px-2 py-1 rounded">
                    {wt.questionCount.choice}选择题
                  </span>
                  <span className="text-xs bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 px-2 py-1 rounded">
                    {wt.questionCount.judge}判断题
                  </span>
                  <span className="text-xs bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 px-2 py-1 rounded">
                    {wt.questionCount.fill}填空题
                  </span>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md">开始考试</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 管理端入口 */}
        <Card className="hover:shadow-xl transition-all bg-gradient-to-r from-white to-blue-50 border-0">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <Users className="h-6 w-6 text-white" />
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
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>请确保在安静、光线充足的环境中进行考试</p>
        </div>

        {/* 版权保护信息 - 蓝色主题，左上角DEC标识 */}
        <div className="mt-12">
          <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-xl overflow-hidden shadow-xl">
            {/* 顶部蓝色标识条 - 左上角DEC */}
            <div className="bg-blue-800/50 px-4 py-3">
              <div className="flex items-center gap-3">
                {/* DEC椭圆Logo */}
                <svg width="40" height="24" viewBox="0 0 36 22">
                  <ellipse cx="18" cy="11" rx="17" ry="10" fill="none" stroke="white" strokeWidth="1.5"/>
                  <text x="18" y="15" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">DEC</text>
                </svg>
                <div className="text-left">
                  <div className="text-sm font-bold text-white leading-tight">东方电气</div>
                  <div className="text-xs text-blue-200 leading-tight tracking-wide">DONGFANG ELECTRIC</div>
                </div>
                <div className="ml-auto text-xs text-blue-200">安全生产培训</div>
              </div>
            </div>
            
            {/* 版权信息主体 */}
            <div className="px-6 py-5 text-center">
              <p className="text-white text-sm mb-1">© {new Date().getFullYear()} 东方电气精细电子材料有限公司</p>
              <p className="text-blue-200 text-xs mb-3">版权所有 · 保留一切权利</p>
              <div className="pt-3 border-t border-blue-400/30">
                <p className="text-white text-sm">
                  本系统由 <span className="font-semibold">蒋曦</span> 制作
                </p>
                <p className="text-blue-200 text-xs mt-1">
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
