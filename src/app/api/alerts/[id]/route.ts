import { NextRequest, NextResponse } from 'next/server';
import { acknowledgeAlert, cancelAlert } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json();
    const id = parseInt(params.id);

    if (action === 'acknowledge') {
      acknowledgeAlert(id);
    } else if (action === 'cancel') {
      cancelAlert(id);
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update alert' 
    }, { status: 500 });
  }
}
