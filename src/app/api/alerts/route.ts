import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Provide a dummy database URL fallback to allow Next.js to compile this file during build time
const prisma = new PrismaClient({
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy"
  }
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Action triggered payload:", body);

    // Create the alert record permanently inside PostgreSQL
    const newAlert = await prisma.alert.create({
      data: {
        type: body.type || "ALERT",
        message: body.message || "No message body provided.",
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, alert: newAlert }, { status: 200 });
  } catch (error) {
    console.error("Database save error:", error);
    return NextResponse.json({ error: "Failed to log action item" }, { status: 500 });
  }
}