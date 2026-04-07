import { prisma } from './prisma';
import { mockPrizes, mockSettings } from './mock-settings';

export async function getSettings() {
  try {
    const settings = await prisma.leaderboardSettings.findFirst({
      orderBy: { createdAt: 'asc' }
    });

    return settings ?? mockSettings;
  } catch {
    return mockSettings;
  }
}

export async function getPrizes() {
  try {
    const prizes = await prisma.leaderboardPrize.findMany({
      orderBy: { rank: 'asc' }
    });

    return prizes.length ? prizes : mockPrizes;
  } catch {
    return mockPrizes;
  }
}
