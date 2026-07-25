// message-list.ts
import { Component, input } from "@angular/core";
import { MessageBubble } from "@app/pages/chat/components/message-bubble/message-bubble";

export interface MessageItem {
    id: string;
    content: string;
    time: string;
    isMine: boolean;
}

@Component({
    selector: 'app-message-list',
    imports: [MessageBubble],
    templateUrl: './message-list.html',
})
export class MessageList {
    messages = input<MessageItem[]>([]);
}