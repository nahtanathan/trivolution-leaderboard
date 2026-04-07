'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (res.ok) window.location.href = '/admin';
    else alert('Wrong password');
  };

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: 'white', padding: 24 }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        padding: 30,
        background: 'linear-gradient(180deg, rgba(27,47,66,0.96), rgba(15,29,42,0.96))',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <h2 style={{ marginTop: 0 }}>Admin Login</h2>
        <p style={{ color: 'rgba(247,243,234,0.65)' }}>Enter the password from your .env file.</p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: 12,
            marginTop: 10,
            width: '100%',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: 'white',
            outline: 'none'
          }}
        />
        <button
          onClick={handleLogin}
          style={{
            marginTop: 12,
            width: '100%',
            padding: 12,
            borderRadius: 12,
            border: 'none',
            background: 'linear-gradient(180deg, #d7c18a, #b89f63)',
            color: '#10202f',
            fontWeight: 900,
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </div>
    </main>
  );
}
