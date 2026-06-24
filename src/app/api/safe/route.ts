import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("=== SAFE ROUTE WAS CALLED ===", new Date().toISOString());

  try {
    const body = await req.json();
    console.log("Body received:", body);

    return NextResponse.json({ success: true, message: "Route reached successfully" });
  } catch (error) {
    console.error("Error in safe route:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}