import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  url.pathname = '/api/cron';
  return NextResponse.redirect(url, 307);
}
