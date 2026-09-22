// message-list.ts
import { Component, effect, ElementRef, input, output, viewChild } from '@angular/core';
import { MessageType } from '@app/core/enums/message.enum';
import { MessageAttachment, MessageReaction } from '@app/core/model/message/message.model';
import { MessageAction, MessageBubble } from '@app/pages/chat/components/message-bubble/message-bubble';
import { LucideAngularModule } from 'lucide-angular';

export interface MessageItem {
  id: string;
  senderId: string;
  content: string;
  time: string;
  isMine: boolean;
  showHeader: boolean;
  senderName: string | null;
  dateLabel: string | null;
  type: MessageType;
  attachments: MessageAttachment[];
  isDeleted: boolean;
  editedAt: string | null;
  replyPreview: string | null;
  seen: boolean;
  reactions: MessageReaction[];
  myReactionEmoji: string | null;
}

const LOAD_MORE_THRESHOLD_PX = 100;

@Component({
  selector: 'app-message-list',
  imports: [MessageBubble, LucideAngularModule],
  templateUrl: './message-list.html',
  host: { class: 'flex min-h-0 flex-1 flex-col' },
})
export class MessageList {
  messages = input<MessageItem[]>([]);
  isLoadingMore = input(false);
  hasMoreMessages = input(true);
  messageAction = output<{ action: MessageAction; message: MessageItem }>();
  toggleReaction = output<{ messageId: string; emoji: string }>();
  loadMore = output<void>();

  private scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  private previousFirstId: string | null = null;
  private previousLastId: string | null = null;
  private pendingScrollRestore: { scrollHeight: number; scrollTop: number } | null = null;

  constructor() {
    effect(() => {
      const list = this.messages();
      const container = this.scrollContainer()?.nativeElement;
      if (!container) return;

      const firstId = list[0]?.id ?? null;
      const lastId = list.at(-1)?.id ?? null;
      const restore = this.pendingScrollRestore;

      if (restore) {
        // older messages were just prepended: keep the viewport anchored on the same message
        this.pendingScrollRestore = null;
        setTimeout(() => {
          const heightDiff = container.scrollHeight - restore.scrollHeight;
          container.scrollTop = restore.scrollTop + heightDiff;
        });
      } else if (firstId !== this.previousFirstId || lastId !== this.previousLastId) {
        // new/initial message set, or a message appended at the bottom -> follow the latest message
        setTimeout(() => container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' }));
      }
      // otherwise the set of messages is unchanged (edit/reaction/in-place delete) -> leave scroll as-is

      this.previousFirstId = firstId;
      this.previousLastId = lastId;
    });
  }

  onScroll(event: Event) {
    if (this.isLoadingMore() || !this.hasMoreMessages()) return;

    const el = event.target as HTMLDivElement;
    if (el.scrollTop <= LOAD_MORE_THRESHOLD_PX) {
      this.pendingScrollRestore = { scrollHeight: el.scrollHeight, scrollTop: el.scrollTop };
      this.loadMore.emit();
    }
  }
}
