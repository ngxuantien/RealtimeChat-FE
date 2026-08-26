// message-list.ts
import { Component, effect, ElementRef, input, viewChild } from '@angular/core';
import { MessageType } from '@app/core/enums/message.enum';
import { MessageAttachment } from '@app/core/model/message/message.model';
import { MessageBubble } from '@app/pages/chat/components/message-bubble/message-bubble';
import { LucideAngularModule } from 'lucide-angular';

export interface MessageItem {
  id: string;
  content: string;
  time: string;
  isMine: boolean;
  showHeader: boolean;
  senderName: string | null;
  dateLabel: string | null;
  type: MessageType;
  attachments: MessageAttachment[];
}

@Component({
  selector: 'app-message-list',
  imports: [MessageBubble, LucideAngularModule],
  templateUrl: './message-list.html',
  host: { class: 'flex min-h-0 flex-1 flex-col' },
})
export class MessageList {
  messages = input<MessageItem[]>([]);

  private scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  constructor() {
    effect(() => {
      this.messages();

      setTimeout(() => {
        const el = this.scrollContainer()?.nativeElement;
        el?.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      });
    });
  }
}
