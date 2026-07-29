// message-list.ts
import { Component, input } from "@angular/core";
import { MessageBubble } from "@app/pages/chat/components/message-bubble/message-bubble";
import { LucideAngularModule } from 'lucide-angular';

export interface MessageItem {
    id: string;
    content: string;
    time: string;
    isMine: boolean;
}

@Component({
    selector: 'app-message-list',
    imports: [MessageBubble, LucideAngularModule],
    templateUrl: './message-list.html',
})
export class MessageList {
    messages = input<MessageItem[]>([]);
}