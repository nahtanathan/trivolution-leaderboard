import { formatMoney, maskUsername } from '../lib/format';

function Movement({ movement }: { movement?: number }) {
  if (!movement) return <span style={{ color: 'rgba(247,243,234,0.34)', fontWeight: 700 }}>—</span>;
  if (movement > 0) return <span style={{ color: '#4ade80', fontWeight: 800 }}>▲ {movement}</span>;
  return <span style={{ color: '#f87171', fontWeight: 800 }}>▼ {Math.abs(movement)}</span>;
}

type LeaderboardEntry = {
  rank: number;
  username: string;
  weightedWagered: number;
  movement?: number;
};

export function LeaderboardList({
  entries,
  prizeForRank
}: {
  entries: LeaderboardEntry[];
  prizeForRank: (rank: number) => string;
}) {
  return (
    <section style={{ maxWidth: 1060, margin: '56px auto 0' }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontSize: 30 }}>Full Rankings</h2>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {entries.map((entry) => (
          <div
            key={entry.rank}
            style={{
              display: 'grid',
              gridTemplateColumns: '90px 1fr 170px 140px 100px',
              gap: 16,
              alignItems: 'center',
              padding: '16px 18px',
              borderRadius: 16,
              background: 'linear-gradient(180deg, rgba(34,56,76,0.94), rgba(21,40,57,0.94))',
              border: '1px solid rgba(255,255,255,0.07)'
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 22, color: '#d7c18a' }}>#{entry.rank}</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{maskUsername(entry.username)}</div>
            <div style={{ fontWeight: 800, textAlign: 'right' }}>{formatMoney(entry.weightedWagered)}</div>
            <div
              style={{
                textAlign: 'center',
                borderRadius: 10,
                padding: '10px 12px',
                background: 'linear-gradient(180deg, #081725, #091a29)',
                fontWeight: 900,
                color: '#f5efe3'
              }}
            >
              {prizeForRank(entry.rank)}
            </div>
            <div style={{ textAlign: 'right' }}><Movement movement={entry.movement} /></div>
          </div>
        ))}
      </div>
    </section>
  );
}
