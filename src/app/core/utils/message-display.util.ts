import { Message } from '@app/core/model/message/message.model';
import { MessageItem } from '@app/pages/chat/components/message-list/message-list';

const GROUP_GAP_MS = 10 * 60 * 1000;

export function toMessageItems(messages: Message[], currentUserId: string): MessageItem[] {
  return messages.map((message, index) => {
    const prev = messages[index - 1];
    const next = messages[index + 1];

    const sameGroupAsPrev =
      !!prev &&
      prev.senderId === message.senderId &&
      new Date(message.createdAt).getTime() - new Date(prev.createdAt).getTime() <= GROUP_GAP_MS;

    const sameGroupAsNext =
      !!next &&
      next.senderId === message.senderId &&
      new Date(next.createdAt).getTime() - new Date(message.createdAt).getTime() <= GROUP_GAP_MS;

    return {
      id: message.id,
      content: message.content,
      time: new Date(message.createdAt).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isMine: message.senderId === currentUserId,
      showTime: !sameGroupAsNext,
      isGroupStart: !sameGroupAsPrev,
    };
  });
}
