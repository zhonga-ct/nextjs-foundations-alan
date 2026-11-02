import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

// 1. Input validation schema
const TransactionSchema = z.object({
  userId: z.uuid(),
  amount: z.number().positive().max(10_000),
});

// Simple in-memory rate limiter (use a Redis provider in production:
// counters here are per-instance and reset on every restart/deploy)
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const limit = requestCounts.get(identifier);

  if (!limit || now > limit.resetAt) {
    requestCounts.set(identifier, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (limit.count >= RATE_LIMIT) {
    return true; // Rate limited
  }

  limit.count++;
  return false;
}

export async function POST(request: NextRequest) {
  // Correlation ID ties server logs to a single request without exposing details
  const requestId = crypto.randomUUID();

  try {
    // 2. Rate limiting (by client IP for demo)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (checkRateLimit(ip)) {
      console.warn(`[${requestId}] Rate limit exceeded for ${ip}`);
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // 3. Input validation (malformed JSON is invalid input, not a server error)
    const body: unknown = await request.json().catch(() => null);
    const result = TransactionSchema.safeParse(body);

    if (!result.success) {
      console.error(`[${requestId}] Validation failed:`, result.error.issues);
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { userId, amount } = result.data;

    // 4. Process transaction (mock)
    const transaction = {
      id: crypto.randomUUID(),
      userId,
      amount,
      timestamp: Date.now(),
    };

    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
      timestamp: transaction.timestamp,
    });
  } catch (error) {
    // 5. Safe error handling: details stay in server logs
    console.error(`[${requestId}] Transaction error:`, error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export function GET() {
  // Mock transaction list
  return NextResponse.json({
    transactions: [
      { id: "1", amount: 100, status: "completed" },
      { id: "2", amount: 250, status: "pending" },
    ],
  });
}
