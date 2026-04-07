import { formatMoney, maskUsername } from '../lib/format';

type Entry = {
  rank: number;
  username: string;
  weightedWagered: number;
  movement?: number;
};

function movementNode(movement?: number) {
  if (!movement) return <span style={{ color: 'rgba(247,243,234,0.34)', fontWeight: 700 }}>—</span>;
  if (movement > 0) return <span style={{ color: '#4ade80', fontWeight: 800 }}>▲ {movement}</span>;
  return <span style={{ color: '#f87171', fontWeight: 800 }}>▼ {Math.abs(movement)}</span>;
}

function largeRank(rank: number) {
  if (rank === 1) return '1ST';
  if (rank === 2) return '2ND';
  if (rank === 3) return '3RD';
  return `#${rank}`;
}

function accentForRank(rank: number) {
  if (rank === 1) return '#d7c18a';
  if (rank === 2) return '#c7d2df';
  return '#c49b7a';
}

export function RankCard({
  entry,
  featured = false,
  prizeLabel
}: {
  entry?: Entry | null;
  featured?: boolean;
  prizeLabel?: string;
}) {
  if (!entry) return null;
  const accent = accentForRank(entry.rank);

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 18,
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(180deg, rgba(39,63,84,0.96), rgba(23,43,60,0.96))',
        boxShadow: featured ? '0 18px 44px rgba(0,0,0,0.26)' : '0 12px 30px rgba(0,0,0,0.20)',
        padding: '18px 14px 16px',
        minHeight: featured ? 308 : 292
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05), transparent 34%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        top: 10,
        left: 12,
        right: 12,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          minWidth: 30,
          height: 30,
          padding: '0 10px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: accent,
          display: 'grid',
          placeItems: 'center',
          fontWeight: 900,
          fontSize: 14
        }}>
          {entry.rank}
        </div>
        <div>{movementNode(entry.movement)}</div>
      </div>

      <div style={{ textAlign: 'center', paddingTop: featured ? 10 : 18 }}>
        <div style={{
          fontSize: featured ? 84 : 74,
          lineHeight: 0.88,
          fontWeight: 900,
          color: 'rgba(7,17,24,0.18)',
          letterSpacing: '-0.04em',
          userSelect: 'none'
        }}>
          {largeRank(entry.rank)}
        </div>

        <div style={{
          width: featured ? 74 : 66,
          height: featured ? 74 : 66,
          margin: '-18px auto 12px',
          borderRadius: 22,
          background: 'linear-gradient(180deg, #12283d, #0a1c2b)',
          display: 'grid',
          placeItems: 'center',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{
            width: featured ? 34 : 30,
            height: featured ? 34 : 30,
            borderRadius: 10,
            background: `linear-gradient(180deg, ${accent}, rgba(255,255,255,0.35))`
          }} />
        </div>

        <div style={{ fontWeight: 800, fontSize: featured ? 16 : 15, minHeight: 22 }}>
          {maskUsername(entry.username)}
        </div>

        <div style={{ marginTop: 20, fontWeight: 800, fontSize: featured ? 18 : 16 }}>
          {formatMoney(entry.weightedWagered)}
        </div>
        <div style={{ marginTop: 4, color: 'rgba(194,214,238,0.92)', fontWeight: 700, fontSize: 14 }}>
          Wagered
        </div>

        <div style={{
          marginTop: 18,
          borderRadius: 8,
          background: 'linear-gradient(180deg, #081725, #091a29)',
          padding: '12px 14px',
          fontWeight: 900,
          fontSize: featured ? 20 : 18,
          color: '#f5efe3'
        }}>
          {prizeLabel || '$ 0'}
        </div>
      </div>
    </div>
  );
}
