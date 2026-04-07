import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TrivolutionSlots Leaderboard',
  description: 'Roobet-style leaderboard with admin panel'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
