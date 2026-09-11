export interface ConversationMember {
    userId: string;
    displayName: string;
    avatarUrl: string | null;
    isOnline: boolean;
    role: string;
    isPinned: boolean;
    isMuted: boolean;
    lastReadMessageId: string | null;
}