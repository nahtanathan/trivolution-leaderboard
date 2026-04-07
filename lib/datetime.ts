export function utcIsoToLocalInputValue(value?: string | Date | null) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function localInputValueToUtcIso(value: string) {
  if (!value) return '';

  const localDate = new Date(value);
  if (Number.isNaN(localDate.getTime())) return '';

  return localDate.toISOString();
}