// chat-window.ts
import { Component, input, output } from "@angular/core";
import { ChatHeader } from "@app/pages/chat/components/chat-header/chat-header";
import { MessageList, MessageItem } from "@app/pages/chat/components/message-list/message-list";
import { ChatInputBar } from "@app/pages/chat/components/chat-input-bar/chat-input-bar";

@Component({
    selector: 'app-chat-window',
    imports: [ChatHeader, MessageList, ChatInputBar],
    templateUrl: './chat-window.html',
    host: { class: 'block' }
})
export class ChatWindow {
    conversationId = input<string | null>(null);
    contactName = input('');
    contactAvatar = input<string | null>(null);
    isOnline = input(false);
    messages = input<MessageItem[]>([]);

    toggleInfo = output<void>();
    sendMessage = output<string>();
}