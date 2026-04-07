import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  cookies().delete('admin');
  return NextResponse.redirect(new URL('/admin/login', req.url));
}
