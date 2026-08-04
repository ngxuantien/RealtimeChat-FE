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
