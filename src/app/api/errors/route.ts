import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withCors } from '@/lib/cors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, message, stack, userAgent, sessionId } = body;

    if (!url || !message || !userAgent || !sessionId) {
      return withCors(request, NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      ));
    }

    const errorLog = await prisma.errorLog.create({
      data: {
        url,
        message,
        stack: stack || null,
        userAgent,
        sessionId,
      },
    });

    return withCors(request, NextResponse.json({ success: true, id: errorLog.id }));
  } catch (error) {
    console.error('保存异常数据失败:', error);
    return withCors(request, NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    ));
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sessionId = searchParams.get('sessionId');
    const url = searchParams.get('url');

    const skip = (page - 1) * limit;

    const where: any = {};
    if (sessionId) where.sessionId = sessionId;
    if (url) where.url = { contains: url };

    const [errors, total] = await Promise.all([
      prisma.errorLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
      }),
      prisma.errorLog.count({ where }),
    ]);

    return withCors(request, NextResponse.json({
      errors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }));
  } catch (error) {
    console.error('获取异常数据失败:', error);
    return withCors(request, NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    ));
  }
}

export function OPTIONS(request: NextRequest) {
  return withCors(request, new NextResponse(null, { status: 204 }));
} 