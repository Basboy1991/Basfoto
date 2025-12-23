import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    hasResendKey: Boolean(process.env.RESEND_API_KEY),
    hasTo: Boolean(process.env.BOOKING_TO_EMAIL),
    hasFrom: Boolean(process.env.BOOKING_FROM_EMAIL),
    hasReplyTo: Boolean(process.env.BOOKING_REPLYTO_EMAIL),
    nodeEnv: process.env.NODE_ENV,
  });
}