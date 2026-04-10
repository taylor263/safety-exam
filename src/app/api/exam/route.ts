import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { getQuestionsByWorkType, type WorkType } from '@/lib/questions';

// 创建带 UTF-8 编码的响应
function jsonResponse(data: Record<string, unknown>, statusOrOptions: number | { status?: number } = 200) {
  const status = typeof statusOrOptions === 'number' ? statusOrOptions : (statusOrOptions.status || 200);
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

// 上传到 ImgBB（免费图床）
async function uploadPhoto(base64Data: string): Promise<string | null> {
  try {
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      console.error('IMGBB_API_KEY 未配置');
      return null;
    }

    // 将 base64 转换为 binary
    const base64Response = await fetch(base64Data);
    const blob = await base64Response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const binary = Buffer.from(arrayBuffer);

    // 上传到 ImgBB
    const formData = new FormData();
    formData.append('image', binary.toString('base64'));

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success && result.data && result.data.url) {
      return result.data.url; // 返回完整图片 URL
    } else {
      console.error('ImgBB 上传失败:', result);
      return null;
    }
  } catch (error) {
    console.error('上传错误:', error);
    return null;
  }
}

// GET - 获取考试记录列表
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const searchParams = request.nextUrl.searchParams;
    const companyName = searchParams.get('companyName');
    const examModule = searchParams.get('examModule');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    let query = supabase
      .from('exam_records')
      .select('*')
      .order('submitted_at', { ascending: false });
    
    if (companyName) {
      query = query.ilike('work_type', `%${companyName}%`);
    }
    
    if (examModule) {
      query = query.eq('exam_module', examModule);
    }
    
    if (startDate) {
      query = query.gte('submitted_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('submitted_at', endDate);
    }
    
    const { data, error } = await query.limit(100);
    
    if (error) {
      console.error('查询失败:', error);
      return jsonResponse({ success: false, error: '查询失败' }, { status: 500 });
    }
    
    return jsonResponse({ success: true, data });
  } catch (error) {
    console.error('服务器错误:', error);
    return jsonResponse({ success: false, error: '服务器错误' }, { status: 500 });
  }
}

// POST - 提交考试成绩
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();
    const {
      companyName,
      name,
      idCard,
      phone,
      examModule,
      photo,
      answers,
      score
    } = body;
    
    // 验证必填字段
    if (!companyName || !name || !idCard || !phone || !examModule) {
      return jsonResponse({ 
        success: false, 
        error: '缺少必填字段：公司名称、姓名、身份证号、手机号、考试模块' 
      }, { status: 400 });
    }
    
    // 验证身份证号格式
    if (!/^\d{17}[\dXx]$/.test(idCard)) {
      return jsonResponse({ 
        success: false, 
        error: '身份证号格式不正确' 
      }, { status: 400 });
    }
    
    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return jsonResponse({ 
        success: false, 
        error: '手机号格式不正确' 
      }, { status: 400 });
    }
    
    // 上传照片
    let photoKey = null;
    if (photo) {
      photoKey = await uploadPhoto(photo);
      if (!photoKey) {
        return jsonResponse({ 
          success: false, 
          error: '照片上传失败，请重试' 
        }, { status: 500 });
      }
    }
    
    // 获取题目信息，构建详细答题记录
    const questions = getQuestionsByWorkType(examModule as WorkType);
    const questionMap = new Map(questions.map(q => [q.id, q]));
    
    // 构建详细答题记录
    const detailedAnswers = Object.entries(answers || {}).map(([questionId, userAnswer]) => {
      const question = questionMap.get(questionId);
      if (!question) {
        return {
          questionId,
          userAnswer: String(userAnswer),
          correct: false,
          // 空值会在前端显示
          question: null,
          correctAnswer: null,
          type: null
        };
      }
      
      const userAns = String(userAnswer).trim().toLowerCase();
      const correctAns = question.answer.trim().toLowerCase();
      const isCorrect = userAns === correctAns;
      
      return {
        questionId,
        question: question.question,
        type: question.type,
        options: question.options || null,
        userAnswer: String(userAnswer),
        correctAnswer: question.answer,
        isCorrect,
        explanation: question.explanation
      };
    });
    
    // 保存到数据库
    // 注意：数据库中使用 work_type 存储公司名称，exam_module 存储考试模块ID
    const { data, error } = await supabase
      .from('exam_records')
      .insert({
        work_type: companyName, // 公司名称存储在 work_type 列
        exam_module: examModule,
        name,
        id_card: idCard,
        phone,
        photo_key: photoKey,
        score,
        answers: JSON.stringify(detailedAnswers),
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('保存失败:', error);
      return jsonResponse({ 
        success: false, 
        error: '保存考试记录失败' 
      }, { status: 500 });
    }
    
    return jsonResponse({ 
      success: true, 
      message: '考试提交成功',
      data: { id: data.id, score: data.score }
    });
  } catch (error) {
    console.error('服务器错误:', error);
    return jsonResponse({ 
      success: false, 
      error: '服务器错误' 
    }, { status: 500 });
  }
}
