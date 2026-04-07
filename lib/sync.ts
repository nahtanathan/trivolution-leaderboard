import { prisma } from './prisma';
import { getSettings } from './settings';

const API_URL = 'https://roobetconnect.com/affiliate/v2/stats';

type SyncSource = 'manual' | 'cron';

type LeaderboardRow = {
  username: string;
  wagered: number;
  weightedWagered: number;
  rank: number;
};

type FetchAffiliateOptions = {
  startDate?: Date | string | null;
  endDate?: Date | string | null;
};

function generateMockData() {
  const base = [
    'LeysComet', 'EUFO619', 'Istorm', 'spinlord88', 'trivioking', 'slotbeastx',
    'hundohunter', 'gatesfan', 'juicebox', 'cashclimber', 'rawspin', 'wheelhero',
    'bonusstack', 'moonmint', 'wilddrop', 'bigchase', 'reelrush', 'vaultace',
    'chipdrip', 'jackpotjay', 'goldgrid', 'wagerwolf', 'reelszn', 'maxrush', 'luckynova'
  ];

  return base.map((username, i) => {
    const baseAmount = Math.max(1000, 125000 - i * 4300);
    const jitter = Math.floor(Math.random() * 6000);
    const weightedWagered = baseAmount + jitter;

    return {
      username,
      wagered: weightedWagered * (1.6 + Math.random() * 0.5),
      weightedWagered
    };
  });
}

async function upsertSyncStatus(source: SyncSource, status: string, message?: string | null) {
  const existing = await prisma.syncStatus.findFirst({
    where: { source },
    orderBy: { createdAt: 'asc' }
  });

  if (existing) {
    await prisma.syncStatus.update({
      where: { id: existing.id },
      data: {
        status,
        message: message || null,
        syncedAt: status === 'success' ? new Date() : existing.syncedAt
      }
    });
    return;
  }

  await prisma.syncStatus.create({
    data: {
      source,
      status,
      message: message || null,
      syncedAt: status === 'success' ? new Date() : null
    }
  });
}

function buildRoobetUrl(options: FetchAffiliateOptions = {}) {
  const url = new URL(API_URL);
  url.searchParams.set('userId', String(process.env.ROOBET_USER_ID ?? ''));
  url.searchParams.set('sortBy', 'wagered');
  url.searchParams.set('categories', 'slots,provably fair');

  if (options.startDate) {
    url.searchParams.set('startDate', new Date(options.startDate).toISOString());
  }

  if (options.endDate) {
    url.searchParams.set('endDate', new Date(options.endDate).toISOString());
  }

  return url.toString();
}

export async function fetchAffiliateRows(options: FetchAffiliateOptions = {}) {
  if (!process.env.ROOBET_API_KEY || !process.env.ROOBET_USER_ID) {
    return generateMockData()
      .sort((a, b) => b.weightedWagered - a.weightedWagered)
      .map((u, i) => ({ ...u, rank: i + 1 })) satisfies LeaderboardRow[];
  }

  const res = await fetch(buildRoobetUrl(options), {
    headers: {
      Authorization: `Bearer ${process.env.ROOBET_API_KEY}`
    },
    cache: 'no-store'
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Roobet request failed: ${res.status}`);
  }

  if (!Array.isArray(data)) {
    throw new Error('Unexpected response shape from Roobet');
  }

  return data
    .map((u: any) => ({
      username: String(u.username ?? ''),
      wagered: Number(u.wagered ?? 0),
      weightedWagered: Number(u.weightedWagered ?? 0)
    }))
    .sort((a, b) => b.weightedWagered - a.weightedWagered)
    .map((u, i) => ({
      ...u,
      rank: i + 1
    })) satisfies LeaderboardRow[];
}

export async function runLeaderboardSync(source: SyncSource) {
  try {
    const settings = await getSettings();
    const sorted = await fetchAffiliateRows({
      startDate: settings.wagerWindowStartAt,
      endDate: settings.endAt
    });

    await prisma.$transaction(async (tx) => {
      await tx.leaderboardEntry.deleteMany();

      if (sorted.length) {
        await tx.leaderboardEntry.createMany({ data: sorted });
        await tx.leaderboardSnapshot.createMany({ data: sorted });
      }
    });

    const mode = process.env.ROOBET_API_KEY && process.env.ROOBET_USER_ID ? 'live' : 'mock';
    await upsertSyncStatus(
      source,
      'success',
      `${mode} sync for ${new Date(settings.wagerWindowStartAt ?? Date.now()).toISOString()} → ${new Date(settings.endAt).toISOString()}`
    );

    return {
      success: true,
      count: sorted.length,
      mode,
      appliedWindow: {
        startDate: settings.wagerWindowStartAt,
        endDate: settings.endAt
      }
    };
  } catch (error: any) {
    await upsertSyncStatus(source, 'error', error?.message ?? 'Unknown error');
    throw error;
  }
}
