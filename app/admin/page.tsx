export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAdminCookiePresent } from '../../lib/auth';
import { getSettings } from '../../lib/settings';
import AdminSettingsForm from './settings-form';

const card: React.CSSProperties = {
  borderRadius: 24,
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'linear-gradient(180deg, rgba(30,54,74,0.94), rgba(19,37,54,0.94))',
  padding: 24
};

export default async function AdminPage() {
  if (!isAdminCookiePresent()) redirect('/admin/login');

  const settings = await getSettings();

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', minHeight: '100vh', padding: '32px 20px 80px', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div
            style={{
              display: 'inline-flex',
              padding: '8px 14px',
              borderRadius: 999,
              border: '1px solid rgba(215,193,138,0.22)',
              background: 'rgba(215,193,138,0.08)',
              color: '#d7c18a',
              fontWeight: 700,
              fontSize: 14
            }}
          >
            Admin
          </div>
          <h1 style={{ fontSize: 46, margin: '16px 0 8px' }}>Leaderboard Control Panel</h1>
          <p style={{ color: 'rgba(247,243,234,0.65)', maxWidth: 760 }}>
            Settings now load from the database and save back to the database.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link
            href="/admin/prizes"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '14px 18px',
              borderRadius: 18,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              fontWeight: 700
            }}
          >
            Edit prizes
          </Link>

          <Link
            href="/leaderboard/trivolutionslots"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '14px 18px',
              borderRadius: 18,
              background: 'linear-gradient(180deg, #d7c18a, #b89f63)',
              color: '#10202f',
              fontWeight: 800
            }}
          >
            Back to leaderboard
          </Link>
        </div>
      </div>

      <section style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={card}>
          <h2 style={{ marginTop: 0 }}>Quick Actions</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            <a
              href="/api/sync"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(180deg, #d7c18a, #b89f63)',
                color: '#10202f',
                padding: '14px 16px',
                borderRadius: 18,
                fontWeight: 900,
                textAlign: 'center'
              }}
            >
              Run Sync
            </a>
          </div>
        </div>

        <div style={card}>
          <h2 style={{ marginTop: 0 }}>Branding + Timer</h2>
          <AdminSettingsForm settings={settings} />
        </div>
      </section>
    </main>
  );
}