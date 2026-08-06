import { MessageStatus, MessageType } from "@app/core/enums/message.enum";

export interface MessageAttachment {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    type: MessageType;
    content: string;
    replyToMessageId: string | null;
    attachments: MessageAttachment[];
    status: MessageStatus;
    isDeleted: boolean;
    deletedBy: string | null;
    editedAt: string | null;
    createdAt: string;
    updatedAt: string | null;
}