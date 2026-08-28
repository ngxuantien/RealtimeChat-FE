// chat-window.ts
import { Component, input, output } from "@angular/core";
import { ChatHeader } from "@app/pages/chat/components/chat-header/chat-header";
import { MessageList, MessageItem } from "@app/pages/chat/components/message-list/message-list";
import { AttachmentBatchPayload, ChatInputBar, EditTarget, ReplyTarget } from "@app/pages/chat/components/chat-input-bar/chat-input-bar";
import { MessageAction } from "../message-bubble/message-bubble";

@Component({
    selector: 'app-chat-window',
    imports: [ChatHeader, MessageList, ChatInputBar],
    templateUrl: './chat-window.html',
    host: { class: 'flex min-h-0 flex-1 flex-col' }
})
export class ChatWindow {
    conversationId = input<string | null>(null);
    contactName = input('');
    contactAvatar = input<string | null>(null);
    isOnline = input(false);
    isGroup = input(false);
    memberCount = input(0);
    messages = input<MessageItem[]>([]);
    sendAttachment = output<AttachmentBatchPayload>();

    replyTarget = input<ReplyTarget | null>(null);
    editTarget = input<EditTarget | null>(null);

    toggleInfo = output<void>();
    sendMessage = output<string>();
    messageAction = output<{ action: MessageAction; message: MessageItem }>();
    saveEdit = output<{ id: string; content: string }>();
    cancelReply = output<void>();
    cancelEdit = output<void>();
}