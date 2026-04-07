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
  const [endAt, setEndAt] = useState(new Date(settings.endAt).toISOString().slice(0, 16));
  const [refreshSeconds, setRefreshSeconds] = useState(String(settings.refreshSeconds));
  const [movementLookbackMinutes, setMovementLookbackMinutes] = useState(String(settings.movementLookbackMinutes));
  const [isSaving, setIsSaving] = useState(false);

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
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Field label="Leaderboard Title" hint="Main title shown at the top of the leaderboard page.">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Weekly Wager Race" style={inputStyle} />
      </Field>

      <Field label="Casino Name" hint="Used in the header and callout text.">
        <input value={casinoName} onChange={(e) => setCasinoName(e.target.value)} placeholder="Roobet" style={inputStyle} />
      </Field>

      <Field label="Promo Code Label" hint="This is the code shown in the 'Use code ...' area.">
        <input value={codeLabel} onChange={(e) => setCodeLabel(e.target.value)} placeholder="NATHAN" style={inputStyle} />
      </Field>

      <Field label="Promo Link URL" hint="Both the logo and the 'Use code ...' text will link here.">
        <input value={promoUrl} onChange={(e) => setPromoUrl(e.target.value)} placeholder="https://..." style={inputStyle} />
      </Field>

      <Field label="Logo URL" hint="Optional. Paste a full image URL for the leaderboard logo.">
        <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." style={inputStyle} />
      </Field>

      <Field label="Countdown End Date / Time" hint="The public countdown updates live every second until this date/time.">
        <input value={endAt} onChange={(e) => setEndAt(e.target.value)} type="datetime-local" style={inputStyle} />
      </Field>

      <Field label="Auto Refresh Seconds" hint="Used for sync timing and refresh-related display logic.">
        <input value={refreshSeconds} onChange={(e) => setRefreshSeconds(e.target.value)} inputMode="numeric" placeholder="60" style={inputStyle} />
      </Field>

      <Field label="Movement Lookback Minutes" hint="How far back to compare rank movement changes.">
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
