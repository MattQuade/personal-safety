import { NextResponse } from "next/server";
import postgres from "postgres";

// Instantiate the database client cleanly. The fallback string keeps the compiler happy at build time.
const sql = postgres(process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Action triggered payload:", body);

    const type = body.type || "ALERT";
    const message = body.message || "No message body provided.";
    const status = "ACTIVE";

    // 1. AUTO-DELETE TRIGGER: Wipe out alerts older than 24 hours
    // (You can change '1 day' to '7 days' or '1 hour' depending on your needs!)
    await sql`
      DELETE FROM "Alert" 
      WHERE "createdAt" < NOW() - INTERVAL '1 day'
    `;
    console.log("Auto-cleanup checked and executed successfully.");

    // 2. INSERT NEW RECORD: Save the incoming alert permanently
    const [newAlert] = await sql`
      INSERT INTO "Alert" (type, message, status, "createdAt", "updatedAt")
      VALUES (${type}, ${message}, ${status}, NOW(), NOW())
      RETURNING *
    `;

    return NextResponse.json({ success: true, alert: newAlert }, { status: 200 });
  } catch (error) {
    console.error("Database operation error:", error);
    return NextResponse.json({ error: "Failed to process alert item" }, { status: 500 });
  }
}