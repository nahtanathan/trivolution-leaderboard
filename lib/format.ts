export function maskUsername(username: string) {
  if (!username) return '';
  if (username.length <= 3) return username[0] + '**';
  return username.slice(0, 3) + '*'.repeat(Math.max(3, username.length - 3));
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value || 0);
}
