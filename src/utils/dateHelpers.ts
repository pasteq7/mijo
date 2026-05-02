export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isToday(dateString: string): boolean {
  return toDateKey(new Date(dateString)) === toDateKey(new Date());
}

export function formatDate(dateKey: string, locale = 'fr-FR'): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function formatDateShort(dateKey: string): string {
  const [, m, d] = dateKey.split('-').map(Number);
  return `${d}/${m}`;
}

export function isDateBeforeToday(dateKey: string): boolean {
  return dateKey < toDateKey(new Date());
}

export function getDateKeys(days = 30): string[] {
  const keys: string[] = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    keys.push(toDateKey(d));
  }
  return keys;
}
