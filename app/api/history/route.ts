import { fetchAffiliateRows } from '../../../lib/sync';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    if (!startDate || !endDate) {
      return Response.json({ error: 'startDate and endDate are required' }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
      return Response.json({ error: 'Invalid date range' }, { status: 400 });
    }

    const rows = await fetchAffiliateRows({ startDate: start, endDate: end });
    return Response.json({ success: true, rows, startDate: start.toISOString(), endDate: end.toISOString() });
  } catch (error: any) {
    return Response.json({ error: 'History fetch failed', details: error?.message ?? 'Unknown error' }, { status: 500 });
  }
}
