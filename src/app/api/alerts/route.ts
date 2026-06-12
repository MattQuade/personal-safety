import { NextRequest, NextResponse } from 'next/server';
import { listAlerts, createAlert } from '@/lib/db';

export async function GET() {
  try {
    const alerts = listAlerts();
    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { message, location } = body;

    const alert = createAlert(
      message ?? "Emergency Alert",
      location ?? null
    );

    return NextResponse.json({ 
      success: true, 
      alert 
    });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create alert' 
    }, { status: 500 });
  }
}

Scroll down → Commit changes.

When you're done, just reply with "File 1 done" and I'll give you the direct link for File 2.Ready when you are. Go ahead and do File 1.

Explore Next.js Server Actions

Check Supabase database schema

Add error handling for missing fields


