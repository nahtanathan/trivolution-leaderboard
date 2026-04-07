import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

function requireAdmin() {
  return cookies().get('admin')?.value === 'true';
}

export async function POST(req: Request) {
  try {
    if (!requireAdmin()) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const prizes = Array.isArray(body.prizes) ? body.prizes : [];

    await prisma.$transaction(
      prizes.map((prize) => {
        const rank = Number(prize.rank);
        const prizeLabel = String(prize.prizeLabel || '').trim();

        return prisma.leaderboardPrize.upsert({
          where: { rank },
          update: { prizeLabel },
          create: { rank, prizeLabel }
        });
      })
    );

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json(
      { error: 'Failed to save prizes', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
