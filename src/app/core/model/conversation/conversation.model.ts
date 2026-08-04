import { ConversationType } from "@app/core/enums/conversation.enum";

export interface Conversation {
    id: string;
    type: ConversationType;
    name: string | null;
    avatarUrl: string | null;
    createdBy: string;
    lastMessageId: string | null;
    lastMessagePreview: string | null;
    lastMessageAt: string | null;
    createdAt: string;
    updatedAt: string | null;
}