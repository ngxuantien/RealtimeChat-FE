import { Conversation } from '@app/core/model/conversation/conversation.model';
import { ConversationMember } from '@app/core/model/conversation/conversation-member.model';
import { ConversationType } from '../enums/conversation.enum';
import { formatConversationTime } from './format-time.util';

export interface ConversationListItem {
  id: string;
  otherUserId: string | null;
  name: string;
  avatarUrl: string | null;
  lastMessage: string;
  lastMessageAt: string | null;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  isPinned: boolean;
  isGroup: boolean;
  memberCount: number;
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
    otherUserId: isGroup ? null : (other?.userId ?? null),
    name,
    avatarUrl,
    lastMessage: conversation.lastMessagePreview ?? 'Chưa có tin nhắn',
    lastMessageAt: conversation.lastMessageAt,
    time: formatConversationTime(conversation.lastMessageAt),
    unreadCount,
    isOnline,
    isGroup,
    isPinned: me?.isPinned ?? false,
    memberCount: members.length,
  };
}
