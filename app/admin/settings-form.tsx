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

type Settings = {
  title: string;
  casinoName: string;
  codeLabel: string;
  logoUrl?: string | null;
  endAt: Date | string;
  refreshSeconds: number;
  movementLookbackMinutes: number;
};

export default function AdminSettingsForm({ settings }: { settings: Settings }) {
  const [title, setTitle] = useState(settings.title);
  const [casinoName, setCasinoName] = useState(settings.casinoName);
  const [codeLabel, setCodeLabel] = useState(settings.codeLabel);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [endAt, setEndAt] = useState(new Date(settings.endAt).toISOString().slice(0, 16));
  const [refreshSeconds, setRefreshSeconds] = useState(String(settings.refreshSeconds));
  const [movementLookbackMinutes, setMovementLookbackMinutes] = useState(String(settings.movementLookbackMinutes));

  const saveSettings = async () => {
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        casinoName,
        codeLabel,
        logoUrl,
        endAt,
        refreshSeconds,
        movementLookbackMinutes
      })
    });

    if (res.ok) alert('Settings saved');
    else {
      const data = await res.json();
      alert(data.error || 'Failed to save settings');
    }
  };

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Leaderboard title" style={inputStyle} />
      <input value={casinoName} onChange={(e) => setCasinoName(e.target.value)} placeholder="Casino name" style={inputStyle} />
      <input value={codeLabel} onChange={(e) => setCodeLabel(e.target.value)} placeholder="Code label" style={inputStyle} />
      <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="Logo URL" style={inputStyle} />
      <input value={endAt} onChange={(e) => setEndAt(e.target.value)} type="datetime-local" style={inputStyle} />
      <input value={refreshSeconds} onChange={(e) => setRefreshSeconds(e.target.value)} placeholder="Refresh seconds" style={inputStyle} />
      <input value={movementLookbackMinutes} onChange={(e) => setMovementLookbackMinutes(e.target.value)} placeholder="Movement lookback minutes" style={inputStyle} />
      <button
        onClick={saveSettings}
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'white',
          padding: '14px 16px',
          borderRadius: 16,
          fontWeight: 800,
          cursor: 'pointer'
        }}
      >
        Save settings
      </button>
    </div>
  );
}