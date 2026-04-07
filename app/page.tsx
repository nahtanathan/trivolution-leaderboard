import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{
        width: '100%',
        maxWidth: 980,
        background: 'linear-gradient(180deg, rgba(26,46,64,0.95), rgba(13,30,45,0.95))',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 28,
        padding: 32
      }}>
        <div style={{
          display: 'inline-flex',
          padding: '8px 14px',
          borderRadius: 999,
          border: '1px solid rgba(215,193,138,0.22)',
          background: 'rgba(215,193,138,0.08)',
          color: '#d7c18a',
          fontWeight: 700,
          fontSize: 14
        }}>
          Production starter
        </div>
        <h1 style={{ fontSize: 54, lineHeight: 0.98, margin: '18px 0 12px' }}>
          TrivolutionSlots Leaderboard
        </h1>
        <p style={{ color: 'rgba(247,243,234,0.7)', fontSize: 18, maxWidth: 760 }}>
          
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
          <Link href="/leaderboard/trivolutionslots" style={{
            background: 'linear-gradient(180deg, #d7c18a, #b89f63)',
            color: '#10202f',
            padding: '14px 18px',
            borderRadius: 18,
            fontWeight: 800
          }}>
            Open leaderboard
          </Link>
          <Link href="/admin/login" style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '14px 18px',
            borderRadius: 18,
            fontWeight: 700
          }}>
            Admin login
          </Link>
        </div>
      </div>
    </main>
  );
}
