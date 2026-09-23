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

  imageClick = output<string>();

  private scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  private previousFirstId: string | null = null;
  private previousLastId: string | null = null;
  private pendingScrollRestore: { scrollHeight: number; scrollTop: number } | null = null;
  private isProgrammaticScroll = false;

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
        this.isProgrammaticScroll = true;
        setTimeout(() => {
          const heightDiff = container.scrollHeight - restore.scrollHeight;
          container.scrollTop = restore.scrollTop + heightDiff;
          this.isProgrammaticScroll = false;
        });
      } else if (firstId !== this.previousFirstId || lastId !== this.previousLastId) {
        // new/initial message set, or a message appended at the bottom -> follow the latest message
        this.isProgrammaticScroll = true;
        setTimeout(() => container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' }));
        // safety net: if the animation gets interrupted (e.g. user scrolls mid-flight) and
        // never settles near the bottom, don't leave loadMore permanently disabled
        setTimeout(() => (this.isProgrammaticScroll = false), 1000);
      }
      // otherwise the set of messages is unchanged (edit/reaction/in-place delete) -> leave scroll as-is

      this.previousFirstId = firstId;
      this.previousLastId = lastId;
    });
  }

  onScroll(event: Event) {
    const el = event.target as HTMLDivElement;

    if (this.isProgrammaticScroll) {
      // a scroll we triggered ourselves (smooth scroll-to-bottom fires intermediate
      // low-scrollTop events while animating) -> ignore until it settles near the bottom
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 4;
      if (atBottom) this.isProgrammaticScroll = false;
      return;
    }

    if (this.isLoadingMore() || !this.hasMoreMessages()) return;

    if (el.scrollTop <= LOAD_MORE_THRESHOLD_PX) {
      this.pendingScrollRestore = { scrollHeight: el.scrollHeight, scrollTop: el.scrollTop };
      this.loadMore.emit();
    }
  }
}
