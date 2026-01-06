import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  try {
    const timestamp = new Date().toISOString();
    await redis.set('sahayak_heartbeat', timestamp);
    
    console.log(`❤️ Heartbeat sent to Upstash at ${timestamp}`);
    return NextResponse.json({ status: 'Alive', timestamp });
    
  } catch (error) {
    console.error("Heartbeat failed:", error);
    return NextResponse.json({ error: "Failed to ping Redis" }, { status: 500 });
  }
}