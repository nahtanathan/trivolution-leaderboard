function timeAgo(date: Date | string | null | undefined) {
  if (!date) return 'Never';
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffSec = Math.max(0, Math.floor((now - then) / 1000));

  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export function SyncStatusBadge({
  status,
  syncedAt,
  message
}: {
  status?: string | null;
  syncedAt?: Date | string | null;
  message?: string | null;
}) {
  const isOk = status === 'success';
  const isError = status === 'error';

  const bg = isOk
    ? 'rgba(74,222,128,0.10)'
    : isError
    ? 'rgba(248,113,113,0.12)'
    : 'rgba(255,255,255,0.08)';

  const border = isOk
    ? '1px solid rgba(74,222,128,0.25)'
    : isError
    ? '1px solid rgba(248,113,113,0.28)'
    : '1px solid rgba(255,255,255,0.10)';

  const color = isOk
    ? '#86efac'
    : isError
    ? '#fca5a5'
    : 'rgba(247,243,234,0.82)';

  return (
    <div
      title={message || ''}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        borderRadius: 999,
        background: bg,
        border,
        color,
        fontWeight: 700,
        fontSize: 13
      }}
    >
      <span>
        {isOk ? 'Updated' : isError ? 'Sync error' : 'Sync status'}
      </span>
      <span style={{ opacity: 0.85 }}>
        {timeAgo(syncedAt)}
      </span>
      {isError && message ? (
        <span style={{ opacity: 0.85, maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {message}
        </span>
      ) : null}
    </div>
  );
}