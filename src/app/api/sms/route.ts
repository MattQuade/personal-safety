import { NextResponse } from "next/server";
import postgres from "postgres";

// Instantiate the direct driver cleanly
const sql = postgres(process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Incoming SMS Webhook payload:", body);

    // TODO: Pull whatever fields your incoming Twilio/SMS payload uses!
    // For example, if it sends a message or phone number:
    const message = body.Body || body.message || "Empty SMS message";
    const sender = body.From || body.sender || "Unknown Sender";

    // Insert your incoming log/sms cleanly using direct SQL
    const [newLog] = await sql`
      INSERT INTO "Alert" (type, message, status, "createdAt", "updatedAt")
      VALUES ('SMS_LOG', ${`From ${sender}: ${message}`}, 'ACTIVE', NOW(), NOW())
      RETURNING *
    `;

    return NextResponse.json({ success: true, log: newLog }, { status: 200 });
  } catch (error) {
    console.error("SMS log processing error:", error);
    return NextResponse.json({ error: "Failed to process incoming SMS payload" }, { status: 500 });
  }
}