export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Medal, Settings2 } from 'lucide-react';
import { Countdown } from '../../../components/countdown';
import { HistoryRangeForm } from '../../../components/history-range-form';
import { LeaderboardList } from '../../../components/leaderboard-list';
import { RankCard } from '../../../components/rank-card';
import { SyncStatusBadge } from '../../../components/sync-status-badge';
import { formatMoney, maskUsername } from '../../../lib/format';
import { prisma } from '../../../lib/prisma';
import { fetchAffiliateRows } from '../../../lib/sync';
import { formatUtcRange } from '../../../lib/datetime';
import { getPrizes, getSettings } from '../../../lib/settings';

type SearchParams = {
  historyStart?: string;
  historyEnd?: string;
};

function prizeFor(prizes: Awaited<ReturnType<typeof getPrizes>>, rank: number) {
  return prizes.find((p) => p.rank === rank)?.prizeLabel || '$0';
}

function MiniHistoryTable({ entries, prize }: { entries: Array<{ rank: number; username: string; weightedWagered: number }>; prize: (rank: number) => string; }) {
  return (
    <div style={{ display: 'grid', gap: 10, marginTop: 18 }}>
      {entries.map((entry) => (
        <div
          key={`${entry.rank}-${entry.username}`}
          style={{
            display: 'grid',
            gridTemplateColumns: '90px 1fr 170px 140px',
            gap: 16,
            alignItems: 'center',
            padding: '14px 18px',
            borderRadius: 16,
            background: 'linear-gradient(180deg, rgba(34,56,76,0.94), rgba(21,40,57,0.94))',
            border: '1px solid rgba(255,255,255,0.07)'
          }}
        >
          <div style={{ fontWeight: 900, fontSize: 22, color: '#d7c18a' }}>#{entry.rank}</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{maskUsername(entry.username)}</div>
          <div style={{ fontWeight: 800, textAlign: 'right' }}>{formatMoney(entry.weightedWagered)}</div>
          <div style={{ textAlign: 'center', borderRadius: 10, padding: '10px 12px', background: 'linear-gradient(180deg, #081725, #091a29)', fontWeight: 900, color: '#f5efe3' }}>{prize(entry.rank)}</div>
        </div>
      ))}
    </div>
  );
}

export default async function LeaderboardPage({ searchParams }: { searchParams?: SearchParams }) {
  const settings = await getSettings();
  const prizes = await getPrizes();

  let entries = [] as Awaited<ReturnType<typeof prisma.leaderboardEntry.findMany>>;
  let latestSync: Awaited<ReturnType<typeof prisma.syncStatus.findFirst>> = null;

  try {
    entries = await prisma.leaderboardEntry.findMany({ orderBy: { rank: 'asc' } });
    latestSync = await prisma.syncStatus.findFirst({ orderBy: { updatedAt: 'desc' } });
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
    where: { createdAt: { lte: lookbackCutoff } },
    orderBy: { createdAt: 'desc' }
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
  const prize = (rank: number) => prizeFor(prizes, rank);

  const historyStart = searchParams?.historyStart ? new Date(searchParams.historyStart) : null;
  const historyEnd = searchParams?.historyEnd ? new Date(searchParams.historyEnd) : null;
  const historyRangeValid = Boolean(
    historyStart && historyEnd && !Number.isNaN(historyStart.getTime()) && !Number.isNaN(historyEnd.getTime()) && historyStart < historyEnd
  );

  const historicalRows = historyRangeValid
    ? await fetchAffiliateRows({ startDate: historyStart, endDate: historyEnd }).catch(() => [])
    : [];

  return (
    <main style={{ maxWidth: 1280, minHeight: '100vh', margin: '0 auto', padding: '26px 20px 80px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div>
          <div style={{
            display: 'inline-flex',
            padding: '8px 14px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.05)',
            fontWeight: 700,
            fontSize: 14,
            color: '#d7c18a'
          }}>
            {settings.casinoName} Wager Race
          </div>

          <h1 style={{ fontSize: 52, lineHeight: 0.95, margin: '14px 0 10px' }}>{settings.title}</h1>

          <div style={{ color: 'rgba(247,243,234,0.72)', fontSize: 13, fontWeight: 700 }}>
            Current stats window: {formatUtcRange(settings.wagerWindowStartAt, settings.endAt)}
          </div>

          <div style={{ marginTop: 14 }}>
            <SyncStatusBadge
              status={latestSync?.status}
              syncedAt={latestSync?.syncedAt}
              message={latestSync?.message}
            />
          </div>
        </div>

        <Link href="/admin" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '14px 18px',
          borderRadius: 18,
          background: 'linear-gradient(180deg, #d7c18a, #b89f63)',
          color: '#10202f',
          fontWeight: 800
        }}>
          <Settings2 size={16} /> Admin
        </Link>
      </header>

      <section style={{ textAlign: 'center', marginTop: 20 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 16px',
          borderRadius: 999,
          border: '1px solid rgba(215,193,138,0.18)',
          background: 'rgba(215,193,138,0.07)',
          color: '#d7c18a',
          fontWeight: 700
        }}>
          <Medal size={16} /> Live leaderboard
        </div>

        <div style={{
          maxWidth: 820,
          margin: '18px auto 0',
          borderRadius: 22,
          border: '1px solid rgba(255,255,255,0.07)',
          background: 'linear-gradient(180deg, rgba(28,52,73,0.96), rgba(19,37,54,0.96))',
          padding: 20
        }}>
          <div style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.24em', color: 'rgba(247,243,234,0.56)' }}>
                How to enter
              </div>
              {settings.promoUrl ? (
                <a href={settings.promoUrl} target="_blank" rel="noreferrer" style={{ marginTop: 10, fontSize: 24, fontWeight: 900, color: 'inherit', textDecoration: 'none', display: 'inline-block' }}>
                  Use code <span style={{ color: '#d7c18a' }}>{settings.codeLabel}</span>
                </a>
              ) : (
                <div style={{ marginTop: 10, fontSize: 24, fontWeight: 900 }}>
                  Use code <span style={{ color: '#d7c18a' }}>{settings.codeLabel}</span>
                </div>
              )}
            </div>

            {settings.logoUrl ? (
              settings.promoUrl ? (
                <a href={settings.promoUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', flexShrink: 0 }}>
                  <img src={settings.logoUrl} alt="Logo" style={{ width: 110, height: 110, objectFit: 'contain', flexShrink: 0 }} />
                </a>
              ) : (
                <img src={settings.logoUrl} alt="Logo" style={{ width: 110, height: 110, objectFit: 'contain', flexShrink: 0 }} />
              )
            ) : null}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1060, margin: '44px auto 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32, alignItems: 'start' }}>
        <div style={{ marginTop: 40 }}><RankCard entry={second} prizeLabel={prize(2)} /></div>
        <div><RankCard entry={first} featured prizeLabel={prize(1)} /></div>
        <div style={{ marginTop: 56 }}><RankCard entry={third} prizeLabel={prize(3)} /></div>
      </section>

      <section style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
        <Countdown endAt={new Date(settings.endAt)} />
      </section>

      <LeaderboardList entries={rest} prizeForRank={prize} />

      <section style={{ maxWidth: 1060, margin: '44px auto 0', borderRadius: 22, border: '1px solid rgba(255,255,255,0.07)', background: 'linear-gradient(180deg, rgba(28,52,73,0.96), rgba(19,37,54,0.96))', padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'rgba(247,243,234,0.56)' }}>Past leaderboard lookup</div>
            <h2 style={{ margin: '10px 0 6px', fontSize: 28 }}>Generate a past leaderboard window</h2>
            <div style={{ color: 'rgba(247,243,234,0.66)', fontSize: 14 }}>Pick a start and end time. The page will pull that date range directly from the affiliate stats API.</div>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <HistoryRangeForm defaultStart={typeof searchParams?.historyStart === 'string' ? searchParams.historyStart : settings.wagerWindowStartAt?.toString() ?? null} defaultEnd={typeof searchParams?.historyEnd === 'string' ? searchParams.historyEnd : settings.endAt.toString()} />
        </div>

        {historyRangeValid ? (
          <div style={{ marginTop: 22 }}>
            <div style={{ color: 'rgba(247,243,234,0.75)', fontSize: 13, fontWeight: 700 }}>
              Historical window: {formatUtcRange(historyStart, historyEnd)}
            </div>

            {historicalRows.length ? (
              <MiniHistoryTable entries={historicalRows} prize={prize} />
            ) : (
              <div style={{ marginTop: 16, color: 'rgba(247,243,234,0.65)' }}>No rows returned for that time window.</div>
            )}
          </div>
        ) : null}
      </section>
    </main>
  );
}
