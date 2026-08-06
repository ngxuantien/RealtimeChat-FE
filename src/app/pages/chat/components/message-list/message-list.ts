// message-list.ts
import { Component, effect, ElementRef, input, viewChild } from '@angular/core';
import { MessageBubble } from '@app/pages/chat/components/message-bubble/message-bubble';
import { LucideAngularModule } from 'lucide-angular';

export interface MessageItem {
  id: string;
  content: string;
  time: string;
  isMine: boolean;
  showTime: boolean;
  isGroupStart: boolean;
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
      this.messages(); // đọc để effect chạy lại mỗi khi danh sách đổi

      setTimeout(() => {
        const el = this.scrollContainer()?.nativeElement;
        el?.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      });
    });
  }
}
