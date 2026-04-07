export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Medal, Settings2 } from 'lucide-react';
import { Countdown } from '../../../components/countdown';
import { LeaderboardList } from '../../../components/leaderboard-list';
import { RankCard } from '../../../components/rank-card';
import { SyncStatusBadge } from '../../../components/sync-status-badge';
import { prisma } from '../../../lib/prisma';
import { getPrizes, getSettings } from '../../../lib/settings';

function isValidUrl(value?: string | null) {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export default async function LeaderboardPage() {
  const settings = await getSettings();
  const prizes = await getPrizes();

  let entries = [] as Awaited<ReturnType<typeof prisma.leaderboardEntry.findMany>>;
  let latestSync: Awaited<ReturnType<typeof prisma.syncStatus.findFirst>> = null;

  try {
    entries = await prisma.leaderboardEntry.findMany({
      orderBy: { rank: 'asc' }
    });

    latestSync = await prisma.syncStatus.findFirst({
      orderBy: { updatedAt: 'desc' }
    });
  } catch {}

  if (!entries.length) {
    return (
      <main style={{ minHeight: '100vh', padding: 40, color: 'white' }}>
        No leaderboard data yet. Run sync in admin.
      </main>
    );
  }

  const lookbackCutoff = new Date(Date.now() - settings.movementLookbackMinutes * 60 * 1000);

  const olderSnapshots = await prisma.leaderboardSnapshot.findMany({
    where: {
      createdAt: {
        lte: lookbackCutoff
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  }).catch(() => []);

  const oldRankMap = new Map<string, number>();
  for (const row of olderSnapshots) {
    if (!oldRankMap.has(row.username)) oldRankMap.set(row.username, row.rank);
  }

  const entriesWithMovement = entries.map((entry) => {
    const oldRank = oldRankMap.get(entry.username);
    return {
      ...entry,
      movement: oldRank ? oldRank - entry.rank : 0
    };
  });

  const [first, second, third, ...rest] = entriesWithMovement;
  const promoUrl = isValidUrl(settings.promoUrl) ? settings.promoUrl : null;

  const prize = (rank: number) => prizes.find((p) => p.rank === rank)?.prizeLabel || '$0';

  return (
    <main style={{ maxWidth: 1280, minHeight: '100vh', margin: '0 auto', padding: '26px 20px 80px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div>
          <div
            style={{
              display: 'inline-flex',
              padding: '8px 14px',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.05)',
              fontWeight: 700,
              fontSize: 14,
              color: '#d7c18a'
            }}
          >
            {settings.casinoName} Wager Race
          </div>

          <h1 style={{ fontSize: 52, lineHeight: 0.95, margin: '14px 0 10px' }}>{settings.title}</h1>

          <div style={{ marginTop: 14 }}>
            <SyncStatusBadge status={latestSync?.status} syncedAt={latestSync?.syncedAt} message={latestSync?.message} />
          </div>
        </div>

        <Link
          href="/admin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 18px',
            borderRadius: 18,
            background: 'linear-gradient(180deg, #d7c18a, #b89f63)',
            color: '#10202f',
            fontWeight: 800
          }}
        >
          <Settings2 size={16} /> Admin
        </Link>
      </header>

      <section style={{ textAlign: 'center', marginTop: 20 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 16px',
            borderRadius: 999,
            border: '1px solid rgba(215,193,138,0.18)',
            background: 'rgba(215,193,138,0.07)',
            color: '#d7c18a',
            fontWeight: 700
          }}
        >
          <Medal size={16} /> Live leaderboard
        </div>

        <div
          style={{
            maxWidth: 820,
            margin: '18px auto 0',
            borderRadius: 22,
            border: '1px solid rgba(255,255,255,0.07)',
            background: 'linear-gradient(180deg, rgba(28,52,73,0.96), rgba(19,37,54,0.96))',
            padding: 20
          }}
        >
          <div style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.24em', color: 'rgba(247,243,234,0.56)' }}>
                How to enter
              </div>

              {promoUrl ? (
                <a
                  href={promoUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    marginTop: 10,
                    fontSize: 24,
                    fontWeight: 900,
                    color: 'inherit',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  Use code <span style={{ color: '#d7c18a' }}>{settings.codeLabel}</span>
                </a>
              ) : (
                <div style={{ marginTop: 10, fontSize: 24, fontWeight: 900 }}>
                  Use code <span style={{ color: '#d7c18a' }}>{settings.codeLabel}</span>
                </div>
              )}
            </div>

            {settings.logoUrl ? (
              promoUrl ? (
                <a href={promoUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', flexShrink: 0 }}>
                  <img
                    src={settings.logoUrl}
                    alt="Logo"
                    style={{
                      width: 110,
                      height: 110,
                      objectFit: 'contain',
                      flexShrink: 0
                    }}
                  />
                </a>
              ) : (
                <img
                  src={settings.logoUrl}
                  alt="Logo"
                  style={{
                    width: 110,
                    height: 110,
                    objectFit: 'contain',
                    flexShrink: 0
                  }}
                />
              )
            ) : null}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1060, margin: '44px auto 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32, alignItems: 'start' }}>
        <div style={{ marginTop: 40 }}>
          <RankCard entry={second} prizeLabel={prize(2)} />
        </div>
        <div>
          <RankCard entry={first} featured prizeLabel={prize(1)} />
        </div>
        <div style={{ marginTop: 56 }}>
          <RankCard entry={third} prizeLabel={prize(3)} />
        </div>
      </section>

      <section style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
        <Countdown endAt={new Date(settings.endAt)} />
      </section>

      <LeaderboardList entries={rest} />
    </main>
  );
}
