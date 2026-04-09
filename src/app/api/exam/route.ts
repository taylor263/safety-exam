import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { S3Storage } from 'coze-coding-dev-sdk';

// 初始化存储
const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  bucketName: process.env.COZE_BUCKET_NAME,
  region: 'cn-beijing',
});

// 提交考试成绩
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, name, idCard, phone, examModule, photo, answers, score } = body;

    // 验证必填字段
    if (!companyName || !name || !idCard || !phone || !examModule || !answers || score === undefined) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 验证照片（必须有照片才能提交）
    if (!photo) {
      return NextResponse.json(
        { error: '必须上传做题照片才能提交' },
        { status: 400 }
      );
    }

    // 上传照片
    let photoKey = '';
    try {
      const base64Data = photo.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      const fileName = `exam-photos/${idCard}_${Date.now()}.jpg`;
      photoKey = await storage.uploadFile({
        fileContent: buffer,
        fileName,
        contentType: 'image/jpeg',
      });
    } catch (uploadError) {
      console.error('照片上传失败:', uploadError);
      return NextResponse.json(
        { error: '照片上传失败' },
        { status: 500 }
      );
    }

    // 保存到数据库
    const client = getSupabaseClient();
    const { data, error } = await client.from('exam_records').insert({
      work_type: companyName, // 公司名称
      name,
      id_card: idCard,
      phone,
      exam_module: examModule, // 考试模块
      photo_key: photoKey,
      score,
      answers,
    }).select();

    if (error) {
      console.error('数据库插入失败:', error);
      return NextResponse.json(
        { error: '保存考试记录失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
    });
  } catch (error) {
    console.error('提交考试失败:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// 获取所有考试记录
export async function GET(request: NextRequest) {
  try {
    const client = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const { data, error, count } = await client
      .from('exam_records')
      .select('id, work_type, name, id_card, phone, exam_module, score, submitted_at', { count: 'exact' })
      .order('submitted_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('查询失败:', error);
      return NextResponse.json(
        { error: '查询失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error('获取考试记录失败:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
