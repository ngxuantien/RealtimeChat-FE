import { Message } from '@app/core/model/message/message.model';
import { ConversationMember } from '@app/core/model/conversation/conversation-member.model';
import { MessageItem } from '@app/pages/chat/components/message-list/message-list';
import { formatDateSeparator } from './format-time.util';

const GROUP_GAP_MS = 10 * 60 * 1000;

function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

export function toMessageItems(
  messages: Message[],
  currentUserId: string,
  members: ConversationMember[],
  isGroup: boolean,
): MessageItem[] {
  const otherMembers = members.filter((m) => m.userId !== currentUserId);
  const indexById = new Map(messages.map((m, i) => [m.id, i]));

  const isReadByMember = (member: ConversationMember, messageIndex: number) => {
    const lastReadIndex = member.lastReadMessageId
      ? indexById.get(member.lastReadMessageId)
      : undefined;
    return lastReadIndex !== undefined && lastReadIndex >= messageIndex;
  };

  let lastMineIndex = -1;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].senderId === currentUserId) {
      lastMineIndex = i;
      break;
    }
  }

  return messages.map((message, index) => {
    const prev = messages[index - 1];
    const current = new Date(message.createdAt);
    const prevDate = prev ? new Date(prev.createdAt) : null;

    const sameGroupAsPrev =
      !!prev &&
      !!prevDate &&
      prev.senderId === message.senderId &&
      isSameDay(current, prevDate) &&
      current.getTime() - prevDate.getTime() <= GROUP_GAP_MS;

    const isMine = message.senderId === currentUserId;
    const sender = members.find((m) => m.userId === message.senderId);

    const replyToMessage = message.replyToMessageId
      ? messages.find((m) => m.id === message.replyToMessageId)
      : null;

    const seen =
      index === lastMineIndex &&
      otherMembers.length > 0 &&
      otherMembers.every((m) => isReadByMember(m, index));

    return {
      id: message.id,
      senderId: message.senderId,
      content: message.content,
      time: current.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isMine,
      showHeader: !sameGroupAsPrev,
      senderName: !isMine && isGroup ? (sender?.displayName ?? 'Người dùng') : null,
      dateLabel:
        !prevDate || !isSameDay(current, prevDate) ? formatDateSeparator(message.createdAt) : null,
      type: message.type,
      attachments: message.isDeleted ? [] : message.attachments,
      isDeleted: message.isDeleted,
      editedAt: message.editedAt,
      replyPreview: message.replyToMessageId
        ? (replyToMessage?.content || '[Tệp đính kèm]').slice(0, 80)
        : null,
      seen,
    };
  });
}
