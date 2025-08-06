import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 这里可以添加数据库连接检查等
    // 例如：await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json(
      { 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    )
  }
} 