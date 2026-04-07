'use client';

import { useEffect, useState } from 'react';
import { localInputToUtcIso, toLocalInputValue } from '../lib/datetime';

type Props = {
  defaultStart?: string | null;
  defaultEnd?: string | null;
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)',
  color: 'white',
  outline: 'none'
};

export function HistoryRangeForm({ defaultStart, defaultEnd }: Props) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    setStart(toLocalInputValue(defaultStart ?? ''));
    setEnd(toLocalInputValue(defaultEnd ?? ''));
  }, [defaultStart, defaultEnd]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams(window.location.search);
        if (start) params.set('historyStart', localInputToUtcIso(start));
        else params.delete('historyStart');
        if (end) params.set('historyEnd', localInputToUtcIso(end));
        else params.delete('historyEnd');
        window.location.href = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      }}
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 12, alignItems: 'end' }}
    >
      <label>
        <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 800, color: 'rgba(247,243,234,0.72)' }}>Start</div>
        <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} style={inputStyle} />
      </label>
      <label>
        <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 800, color: 'rgba(247,243,234,0.72)' }}>End</div>
        <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} style={inputStyle} />
      </label>
      <button
        type="submit"
        style={{
          height: 46,
          border: 'none',
          borderRadius: 14,
          padding: '0 16px',
          background: 'linear-gradient(180deg, #d7c18a, #b89f63)',
          color: '#10202f',
          fontWeight: 900,
          cursor: 'pointer'
        }}
      >
        View
      </button>
      <button
        type="button"
        onClick={() => {
          const params = new URLSearchParams(window.location.search);
          params.delete('historyStart');
          params.delete('historyEnd');
          window.location.href = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
        }}
        style={{
          height: 46,
          borderRadius: 14,
          padding: '0 16px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.10)',
          color: 'white',
          fontWeight: 800,
          cursor: 'pointer'
        }}
      >
        Clear
      </button>
    </form>
  );
}
