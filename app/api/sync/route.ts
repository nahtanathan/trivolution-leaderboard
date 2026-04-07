import { cookies } from 'next/headers';
import { isCronAuthorized } from '../../../lib/auth';
import { runLeaderboardSync } from '../../../lib/sync';

export const dynamic = 'force-dynamic';

function isAuthorized(req: Request) {
  const cookieOk = cookies().get('admin')?.value === 'true';
  return cookieOk || isCronAuthorized(req);
}

export async function GET(req: Request) {
  try {
    if (!isAuthorized(req)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await runLeaderboardSync('manual');
    return Response.json(result);
  } catch (error: any) {
    return Response.json(
      {
        error: 'Sync failed',
        details: error?.message ?? 'Unknown error'
      },
      { status: 500 }
    );
  }
}
