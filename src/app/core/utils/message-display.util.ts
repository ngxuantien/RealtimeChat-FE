import { Message } from '@app/core/model/message/message.model';
import { MessageItem } from '@app/pages/chat/components/message-list/message-list';

export function toMessageItem(message: Message, currentUserId: string): MessageItem {
    return {
        id: message.id,
        content: message.content,
        time: new Date(message.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isMine: message.senderId === currentUserId,
    };
}