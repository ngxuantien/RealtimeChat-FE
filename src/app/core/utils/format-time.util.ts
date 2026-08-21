export function formatConversationTime(iso: string | null): string {
  if (!iso) return '';

  const date = new Date(iso);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày`;

  return date.toLocaleDateString('vi-VN');
}

export function formatDateSeparator(iso: string): string {
  const date = new Date(iso);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) return 'Hôm nay';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Hôm qua';

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  });
}