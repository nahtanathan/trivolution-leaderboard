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

function toLocalInputValue(date: Date | string) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function toUtcIso(localValue: string) {
  if (!localValue) return '';
  const d = new Date(localValue);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString();
}

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

  // 🔥 FIXED — local display
  const [endAt, setEndAt] = useState(toLocalInputValue(settings.endAt));

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
          // 🔥 convert to UTC here
          endAt: toUtcIso(endAt),
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
        <input value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
      </Field>

      <Field label="Casino Name">
        <input value={casinoName} onChange={(e) => setCasinoName(e.target.value)} style={inputStyle} />
      </Field>

      <Field label="Promo Code Label">
        <input value={codeLabel} onChange={(e) => setCodeLabel(e.target.value)} style={inputStyle} />
      </Field>

      <Field label="Promo Link URL">
        <input value={promoUrl} onChange={(e) => setPromoUrl(e.target.value)} style={inputStyle} />
      </Field>

      <Field label="Logo URL">
        <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} style={inputStyle} />
      </Field>

      <Field
        label="Countdown End Time"
        hint="Uses your local time. Saved automatically as UTC."
      >
        <input
          value={endAt}
          onChange={(e) => setEndAt(e.target.value)}
          type="datetime-local"
          style={inputStyle}
        />
      </Field>

      <Field label="Auto Refresh Seconds">
        <input value={refreshSeconds} onChange={(e) => setRefreshSeconds(e.target.value)} style={inputStyle} />
      </Field>

      <Field label="Movement Lookback Minutes">
        <input value={movementLookbackMinutes} onChange={(e) => setMovementLookbackMinutes(e.target.value)} style={inputStyle} />
      </Field>

      <button onClick={saveSettings} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save settings'}
      </button>
    </div>
  );
}