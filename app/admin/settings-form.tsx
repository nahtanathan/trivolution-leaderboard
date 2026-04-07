'use client';

import { useEffect, useState } from 'react';
import { localInputToUtcIso, toLocalInputValue } from '../../lib/datetime';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)',
  color: 'white',
  outline: 'none'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: 8,
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: '0.04em',
  color: 'rgba(247,243,234,0.88)'
};

const hintStyle: React.CSSProperties = {
  marginTop: 6,
  fontSize: 12,
  color: 'rgba(247,243,234,0.55)',
  lineHeight: 1.5
};

type Settings = {
  title: string;
  casinoName: string;
  codeLabel: string;
  logoUrl?: string | null;
  promoUrl?: string | null;
  endAt: Date | string;
  wagerWindowStartAt?: Date | string | null;
  refreshSeconds: number;
  movementLookbackMinutes: number;
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label>
      <span style={labelStyle}>{label}</span>
      {children}
      {hint ? <div style={hintStyle}>{hint}</div> : null}
    </label>
  );
}

export default function AdminSettingsForm({ settings }: { settings: Settings }) {
  const [title, setTitle] = useState(settings.title);
  const [casinoName, setCasinoName] = useState(settings.casinoName);
  const [codeLabel, setCodeLabel] = useState(settings.codeLabel);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [promoUrl, setPromoUrl] = useState(settings.promoUrl || '');
  const [wagerWindowStartAt, setWagerWindowStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [refreshSeconds, setRefreshSeconds] = useState(String(settings.refreshSeconds));
  const [movementLookbackMinutes, setMovementLookbackMinutes] = useState(String(settings.movementLookbackMinutes));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setWagerWindowStartAt(toLocalInputValue(settings.wagerWindowStartAt || ''));
    setEndAt(toLocalInputValue(settings.endAt));
  }, [settings.wagerWindowStartAt, settings.endAt]);

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          casinoName,
          codeLabel,
          logoUrl,
          promoUrl,
          wagerWindowStartAt: wagerWindowStartAt ? localInputToUtcIso(wagerWindowStartAt) : '',
          endAt: localInputToUtcIso(endAt),
          refreshSeconds,
          movementLookbackMinutes
        })
      });

      if (res.ok) alert('Settings saved');
      else {
        const data = await res.json();
        alert(data.error || 'Failed to save settings');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Field label="Leaderboard Title">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Weekly Wager Race" style={inputStyle} />
      </Field>

      <Field label="Casino Name">
        <input value={casinoName} onChange={(e) => setCasinoName(e.target.value)} placeholder="Roobet" style={inputStyle} />
      </Field>

      <Field label="Promo Code Label">
        <input value={codeLabel} onChange={(e) => setCodeLabel(e.target.value)} placeholder="TRIVOLUTION" style={inputStyle} />
      </Field>

      <Field label="Promo Link URL" hint="Both the logo and the use-code text link here.">
        <input value={promoUrl} onChange={(e) => setPromoUrl(e.target.value)} placeholder="https://..." style={inputStyle} />
      </Field>

      <Field label="Logo URL">
        <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." style={inputStyle} />
      </Field>

      <Field label="Wager Window Start" hint="Entered in your local time. Stats only count wagers after this time.">
        <input value={wagerWindowStartAt} onChange={(e) => setWagerWindowStartAt(e.target.value)} type="datetime-local" style={inputStyle} />
      </Field>

      <Field label="Wager Window End / Countdown End" hint="Entered in your local time. The countdown and counted wager window both stop here.">
        <input value={endAt} onChange={(e) => setEndAt(e.target.value)} type="datetime-local" style={inputStyle} />
      </Field>

      <Field label="Auto Refresh Seconds">
        <input value={refreshSeconds} onChange={(e) => setRefreshSeconds(e.target.value)} inputMode="numeric" placeholder="60" style={inputStyle} />
      </Field>

      <Field label="Movement Lookback Minutes">
        <input value={movementLookbackMinutes} onChange={(e) => setMovementLookbackMinutes(e.target.value)} inputMode="numeric" placeholder="30" style={inputStyle} />
      </Field>

      <button
        onClick={saveSettings}
        disabled={isSaving}
        style={{
          background: isSaving ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'white',
          padding: '14px 16px',
          borderRadius: 16,
          fontWeight: 800,
          cursor: isSaving ? 'not-allowed' : 'pointer',
          opacity: isSaving ? 0.7 : 1
        }}
      >
        {isSaving ? 'Saving...' : 'Save settings'}
      </button>
    </div>
  );
}
