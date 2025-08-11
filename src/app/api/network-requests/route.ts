import { NextRequest, NextResponse } from 'next/server';
import { withCors } from '@/lib/cors';
import { truncateString } from '@/lib/utils';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const safeUrl = truncateString(data.url, 255);
    
    // 保存网络请求数据到数据库
    await prisma.networkRequest.create({
      data: {
        url: safeUrl,
        method: data.method,
        status: data.status,
        statusText: data.statusText,
        responseTime: data.responseTime,
        requestHeaders: data.requestHeaders,
        responseHeaders: data.responseHeaders,
        requestBody: data.requestBody,
        responseBody: data.responseBody,
        error: data.error,
        userAgent: data.userAgent,
        sessionId: data.sessionId,
        timestamp: new Date()
      }
    });

    return withCors(request, NextResponse.json({ success: true }));
  } catch (error) {
    console.error('保存网络请求数据失败:', error);
    return withCors(request, NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    ));
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const sessionId = searchParams.get('sessionId');
    
    const where: any = {};
    if (sessionId) {
      where.sessionId = sessionId;
    }
    
    const requests = await prisma.networkRequest.findMany({
      where,
      orderBy: {
        timestamp: 'desc'
      },
      take: limit
    });

    return withCors(request, NextResponse.json({ requests }));
  } catch (error) {
    console.error('获取网络请求数据失败:', error);
    return withCors(request, NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    ));
  }
}

export function OPTIONS(request: NextRequest) {
  return withCors(request, new NextResponse(null, { status: 204 }));
} 