'use client';

import { useEffect, useMemo, useState } from 'react';

function getTimeParts(endAt: Date | string | number) {
  const now = Date.now();
  const end = new Date(endAt).getTime();
  const diff = Math.max(0, end - now);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
    secs: Math.floor((diff / 1000) % 60)
  };
}

function formatUnit(value: number) {
  return value.toString().padStart(2, '0');
}

export function Countdown({ endAt }: { endAt: Date | string }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeParts(endAt));

  useEffect(() => {
    setTimeLeft(getTimeParts(endAt));

    const timer = window.setInterval(() => {
      setTimeLeft(getTimeParts(endAt));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [endAt]);

  const boxStyle: React.CSSProperties = useMemo(() => ({
    minWidth: 74,
    padding: '12px 14px',
    borderRadius: 16,
    background: 'linear-gradient(180deg, rgba(13,31,47,0.96), rgba(8,21,32,0.96))',
    border: '1px solid rgba(255,255,255,0.07)',
    textAlign: 'center'
  }), []);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 360,
        borderRadius: 22,
        background: 'rgba(18,35,52,0.82)',
        border: '1px solid rgba(255,255,255,0.07)',
        padding: 18
      }}
    >
      <div
        style={{
          textAlign: 'center',
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: '0.16em',
          color: 'rgba(247,243,234,0.65)'
        }}
      >
        Time Remaining
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
        <div style={boxStyle}><div style={{ fontSize: 34, fontWeight: 900 }}>{formatUnit(timeLeft.days)}</div><div style={{ fontSize: 10, opacity: 0.62 }}>DAYS</div></div>
        <div style={boxStyle}><div style={{ fontSize: 34, fontWeight: 900 }}>{formatUnit(timeLeft.hours)}</div><div style={{ fontSize: 10, opacity: 0.62 }}>HRS</div></div>
        <div style={boxStyle}><div style={{ fontSize: 34, fontWeight: 900 }}>{formatUnit(timeLeft.mins)}</div><div style={{ fontSize: 10, opacity: 0.62 }}>MIN</div></div>
        <div style={boxStyle}><div style={{ fontSize: 34, fontWeight: 900 }}>{formatUnit(timeLeft.secs)}</div><div style={{ fontSize: 10, opacity: 0.62 }}>SEC</div></div>
      </div>
    </div>
  );
}
