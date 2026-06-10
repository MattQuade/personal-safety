import { NextRequest, NextResponse } from 'next/server';
import { getAlerts, createAlert } from '@/lib/db';

export async function GET() {
  const alerts = getAlerts();
  return NextResponse.json(alerts);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { message, location } = body;

  const id = createAlert(message ?? null, location ?? null);

  return NextResponse.json({ id });
}