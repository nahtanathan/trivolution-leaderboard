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

    const promoUrl = body.promoUrl ? String(body.promoUrl).trim() : null;

    const payload = {
      title: String(body.title || 'TrivolutionSlots').trim(),
      casinoName: String(body.casinoName || 'Roobet').trim(),
      codeLabel: String(body.codeLabel || 'TRIVOLUTION').trim(),
      logoUrl: body.logoUrl ? String(body.logoUrl).trim() : null,
      promoUrl,
      endAt: body.endAt ? new Date(body.endAt) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      refreshSeconds: Math.max(5, Number(body.refreshSeconds || 60)),
      movementLookbackMinutes: Math.max(1, Number(body.movementLookbackMinutes || 30))
    };

    if (Number.isNaN(payload.endAt.getTime())) {
      return Response.json({ error: 'Invalid end date' }, { status: 400 });
    }

    if (promoUrl) {
      try {
        new URL(promoUrl);
      } catch {
        return Response.json({ error: 'Invalid promo URL' }, { status: 400 });
      }
    }

    const existing = await prisma.leaderboardSettings.findFirst({
      orderBy: { createdAt: 'asc' }
    });

    const saved = existing
      ? await prisma.leaderboardSettings.update({
          where: { id: existing.id },
          data: payload
        })
      : await prisma.leaderboardSettings.create({ data: payload });

    return Response.json({ success: true, settings: saved });
  } catch (error: any) {
    return Response.json(
      { error: 'Failed to save settings', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
