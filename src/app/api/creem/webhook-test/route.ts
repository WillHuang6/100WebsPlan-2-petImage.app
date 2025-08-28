import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headers = Object.fromEntries(request.headers.entries());
    
    // 尝试解析 JSON
    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch {
      parsedBody = body;
    }
    
    // 记录接收到的 webhook 数据
    console.log('=== Creem Webhook Test ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Headers:', JSON.stringify(headers, null, 2));
    console.log('Raw Body:', body);
    console.log('Parsed Body:', JSON.stringify(parsedBody, null, 2));
    
    // 特别关注事件类型字段
    if (parsedBody && typeof parsedBody === 'object') {
      console.log('Event Type:', parsedBody.eventType || parsedBody.type || 'NOT_FOUND');
      console.log('Event Data Keys:', Object.keys(parsedBody));
    }
    
    return NextResponse.json({ 
      received: true, 
      timestamp: new Date().toISOString(),
      message: 'Creem webhook test received successfully',
      eventType: parsedBody?.eventType || parsedBody?.type || 'unknown',
      dataKeys: parsedBody && typeof parsedBody === 'object' ? Object.keys(parsedBody) : []
    });
  } catch (error) {
    console.error('Webhook test error:', error);
    return NextResponse.json(
      { 
        error: 'Webhook test failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook test endpoint is working',
    timestamp: new Date().toISOString()
  });
}