import { cookies, headers } from 'next/headers';

export function isAdminCookiePresent() {
  return cookies().get('admin')?.value === 'true';
}

export function getCronSecretFromRequest(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length).trim();
  }

  return req.headers.get('x-cron-key');
}

export function isCronAuthorized(req: Request) {
  const secret = getCronSecretFromRequest(req);
  return Boolean(process.env.CRON_SECRET && secret === process.env.CRON_SECRET);
}

export function getBaseUrlFromHeaders() {
  const h = headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'https';

  if (!host) return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return `${proto}://${host}`;
}
