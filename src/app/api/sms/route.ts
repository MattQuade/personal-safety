import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("SMS Webhook received:", body);
    return NextResponse.json({ success: true, message: "SMS processed" }, { status: 200 });
  } catch (error) {
    console.error("SMS route error:", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}