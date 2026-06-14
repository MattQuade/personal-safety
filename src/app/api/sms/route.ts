import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json();

    console.log('SMS Request - To:', to, '| Message:', message);

    if (!to || !message) {
      return NextResponse.json({ error: 'Missing phone number or message' }, { status: 400 });
    }

    let cleanNumber = to.replace(/\s+/g, '').trim();
    if (!cleanNumber.startsWith('+')) {
      cleanNumber = '+' + cleanNumber;
    }

    const auth = Buffer.from(
      `${process.env.MESSAGEMEDIA_API_KEY}:${process.env.MESSAGEMEDIA_API_SECRET}`
    ).toString('base64');

    const payload = {
      messages: [{
        content: message,
        destination_number: cleanNumber,
        source_number: '+61401290727',
        format: 'SMS'
      }]
    };

    const response = await fetch('https://api.messagemedia.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('MessageMedia Error:', result);
      return NextResponse.json({ error: result }, { status: 400 });
    }

    console.log('✅ SMS sent successfully');
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('SMS Exception:', error);
    return NextResponse.json({ error: error.message || 'Failed to send SMS' }, { status: 500 });
  }
}