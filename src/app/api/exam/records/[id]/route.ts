import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { S3Storage } from 'coze-coding-dev-sdk';

const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  bucketName: process.env.COZE_BUCKET_NAME,
  region: 'cn-beijing',
});

// 创建带 UTF-8 编码的响应
function jsonResponse(data: any, statusOrOptions: number | { status?: number } = 200) {
  const status = typeof statusOrOptions === 'number' ? statusOrOptions : (statusOrOptions.status || 200);
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

// 获取单个考试记录详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('exam_records')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('查询失败:', error);
      return jsonResponse(
        { error: '查询失败' },
        { status: 500 }
      );
    }

    if (!data) {
      return jsonResponse(
        { error: '记录不存在' },
        { status: 404 }
      );
    }

    // 生成照片访问 URL
    let photoUrl = '';
    if (data.photo_key) {
      try {
        photoUrl = await storage.generatePresignedUrl({
          key: data.photo_key,
          expireTime: 86400, // 24小时
        });
      } catch (urlError) {
        console.error('生成照片URL失败:', urlError);
      }
    }

    return jsonResponse({
      success: true,
      data: {
        ...data,
        photo_url: photoUrl,
      },
    });
  } catch (error) {
    console.error('获取考试记录失败:', error);
    return jsonResponse(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
