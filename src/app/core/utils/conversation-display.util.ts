import { Conversation } from '@app/core/model/conversation/conversation.model';
import { ConversationMember } from '@app/core/model/conversation/conversation-member.model';
import { ConversationType } from '../enums/conversation.enum';
import { formatConversationTime } from './format-time.util';

export interface ConversationListItem {
  id: string;
  name: string;
  avatarUrl: string | null;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  isPinned: boolean;
}

export function toConversationListItem(
  conversation: Conversation,
  members: ConversationMember[],
  currentUserId: string,
  unreadCount = 0,
): ConversationListItem {
  const me = members.find((m) => m.userId === currentUserId);
  const other = members.find((m) => m.userId !== currentUserId);
  const isGroup = conversation.type === ConversationType.Group;

  const name = isGroup ? (conversation.name ?? 'Nhóm chat') : (other?.displayName ?? 'Người dùng');
  const avatarUrl = isGroup ? conversation.avatarUrl : (other?.avatarUrl ?? null);
  const isOnline = isGroup ? false : (other?.isOnline ?? false);

  return {
    id: conversation.id,
    name,
    avatarUrl,
    lastMessage: conversation.lastMessagePreview ?? 'Chưa có tin nhắn',
    time: formatConversationTime(conversation.lastMessageAt),
    unreadCount,
    isOnline,
    isPinned: me?.isPinned ?? false,
  };
}
