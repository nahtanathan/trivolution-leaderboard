import { isCronAuthorized } from '../../../lib/auth';
import { runLeaderboardSync } from '../../../lib/sync';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    if (!isCronAuthorized(req)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await runLeaderboardSync('cron');
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
