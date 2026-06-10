import { NextRequest, NextResponse } from 'next/server';
import { acknowledgeAlert, cancelAlert } from '@/lib/db';

type Params = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Params) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const action = body.action;

  if (action === 'acknowledge') {
    acknowledgeAlert(id);
  } else if (action === 'cancel') {
    cancelAlert(id);
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}