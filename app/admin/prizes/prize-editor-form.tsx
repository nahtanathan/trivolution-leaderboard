'use client';

import { useState } from 'react';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)',
  color: 'white',
  outline: 'none'
};

type Prize = {
  rank: number;
  prizeLabel: string;
};

export default function PrizeEditorForm({ prizes: initialPrizes }: { prizes: Prize[] }) {
  const [prizes, setPrizes] = useState(initialPrizes);

  const updatePrize = (rank: number, prizeLabel: string) => {
    setPrizes((prev) => prev.map((p) => (p.rank === rank ? { ...p, prizeLabel } : p)));
  };

  const savePrizes = async () => {
    const res = await fetch('/api/admin/prizes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prizes })
    });

    if (res.ok) alert('Prizes saved');
    else {
      const data = await res.json();
      alert(data.error || 'Failed to save prizes');
    }
  };

  return (
    <>
      <div style={{ display: 'grid', gap: 12 }}>
        {prizes.map((row) => (
          <div
            key={row.rank}
            style={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr',
              gap: 14,
              alignItems: 'center'
            }}
          >
            <div style={{
              padding: '14px 16px',
              borderRadius: 16,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              fontWeight: 800,
              color: '#d7c18a',
              textAlign: 'center'
            }}>
              #{row.rank}
            </div>

            <input
              value={row.prizeLabel}
              onChange={(e) => updatePrize(row.rank, e.target.value)}
              style={inputStyle}
            />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <button
          onClick={savePrizes}
          style={{
            background: 'linear-gradient(180deg, #d7c18a, #b89f63)',
            color: '#10202f',
            padding: '14px 16px',
            borderRadius: 16,
            border: 'none',
            fontWeight: 900,
            cursor: 'pointer'
          }}
        >
          Save prizes
        </button>
      </div>
    </>
  );
}