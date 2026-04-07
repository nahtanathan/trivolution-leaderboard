export function Countdown({ endAt }: { endAt: Date }) {
  const now = Date.now();
  const end = new Date(endAt).getTime();
  const diff = Math.max(0, end - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  const boxStyle: React.CSSProperties = {
    minWidth: 74,
    padding: '12px 14px',
    borderRadius: 16,
    background: 'linear-gradient(180deg, rgba(13,31,47,0.96), rgba(8,21,32,0.96))',
    border: '1px solid rgba(255,255,255,0.07)',
    textAlign: 'center'
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: 360,
      borderRadius: 22,
      background: 'rgba(18,35,52,0.82)',
      border: '1px solid rgba(255,255,255,0.07)',
      padding: 18
    }}>
      <div style={{
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: '0.16em',
        color: 'rgba(247,243,234,0.65)'
      }}>
        Time Remaining
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
        <div style={boxStyle}><div style={{ fontSize: 34, fontWeight: 900 }}>{days}</div><div style={{ fontSize: 10, opacity: 0.62 }}>DAYS</div></div>
        <div style={boxStyle}><div style={{ fontSize: 34, fontWeight: 900 }}>{hours}</div><div style={{ fontSize: 10, opacity: 0.62 }}>HRS</div></div>
        <div style={boxStyle}><div style={{ fontSize: 34, fontWeight: 900 }}>{mins}</div><div style={{ fontSize: 10, opacity: 0.62 }}>MIN</div></div>
        <div style={boxStyle}><div style={{ fontSize: 34, fontWeight: 900 }}>{secs}</div><div style={{ fontSize: 10, opacity: 0.62 }}>SEC</div></div>
      </div>
    </div>
  );
}
