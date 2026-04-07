export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAdminCookiePresent } from '../../../lib/auth';
import { getPrizes } from '../../../lib/settings';
import PrizeEditorForm from './prize-editor-form';

const card: React.CSSProperties = {
  borderRadius: 24,
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'linear-gradient(180deg, rgba(30,54,74,0.94), rgba(19,37,54,0.94))',
  padding: 24
};

export default async function PrizePage() {
  if (!isAdminCookiePresent()) redirect('/admin/login');

  const prizes = await getPrizes();

  return (
    <main style={{ maxWidth: 980, margin: '0 auto', minHeight: '100vh', padding: '32px 20px 80px', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
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
            Prize editor
          </div>
          <h1 style={{ fontSize: 42, margin: '16px 0 8px' }}>Place / Prize Setup</h1>
          <p style={{ color: 'rgba(247,243,234,0.65)' }}>
            Prize values load from the database and save back to the database.
          </p>
        </div>

        <Link href="/admin" style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '14px 18px',
          borderRadius: 18,
          background: 'linear-gradient(180deg, #d7c18a, #b89f63)',
          color: '#10202f',
          fontWeight: 800
        }}>
          Back to admin
        </Link>
      </div>

      <div style={{ ...card, marginTop: 28 }}>
        <PrizeEditorForm prizes={prizes} />
      </div>
    </main>
  );
}