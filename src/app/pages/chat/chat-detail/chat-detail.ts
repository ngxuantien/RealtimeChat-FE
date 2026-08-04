import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { ChatWindow } from '@app/pages/chat/components/chat-window/chat-window';
import { InfoPanel } from '@app/pages/chat/components/info-panel/info-panel';
import { MessageItem } from '@app/pages/chat/components/message-list/message-list';
import { MOCK_MESSAGES } from '@app/pages/chat/mock-data';
import { AuthService } from '@app/core/service/auth.service';
import { ConversationService } from '@app/core/service/conversation.service';
import {
  ConversationListItem,
  toConversationListItem,
} from '@app/core/utils/conversation-display.util';
import { MessageService } from '@app/core/service/message.service';
import { FlashMessageService } from '@app/core/service/common/flash-message.service';
import { toMessageItem } from '@app/core/utils/message-display.util';

@Component({
  selector: 'app-chat-detail',
  imports: [ChatWindow, InfoPanel],
  templateUrl: './chat-detail.html',
  host: { class: 'flex min-h-0 flex-1' },
})
export class ChatDetail {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private conversationService = inject(ConversationService);
  private messageService = inject(MessageService);
  private flashMessage = inject(FlashMessageService);

  conversationId = toSignal(this.route.paramMap.pipe(map((p) => p.get('conversationId')!)));

  conversation = signal<ConversationListItem | null>(null);
  messages = signal<MessageItem[]>([]);
  showInfoPanel = signal(false);

  constructor() {
    effect(() => {
      const id = this.conversationId();
      const currentUserId = this.authService.currentUser()?.userId;

      if (!id || !currentUserId) {
        this.conversation.set(null);
        return;
      }

      this.conversationService
        .getById(id)
        .pipe(
          switchMap((conv) =>
            this.conversationService
              .getMembers(id)
              .pipe(map((members) => toConversationListItem(conv, members, currentUserId))),
          ),
        )
        .subscribe((item) => this.conversation.set(item));
    });

    effect(() => {
      const id = this.conversationId();
      const currentUserId = this.authService.currentUser()?.userId;

      if (!id || !currentUserId) {
        this.messages.set([]);
        return;
      }

      this.messageService.getMessages(id).subscribe((list) => {
        const chronological = [...list].reverse();
        this.messages.set(chronological.map((m) => toMessageItem(m, currentUserId)));
      });
    });
  }

  toggleInfoPanel() {
    this.showInfoPanel.update((v) => !v);
  }

  onSendMessage(content: string) {
    const conversationId = this.conversationId();
    const currentUserId = this.authService.currentUser()?.userId;

    if (!conversationId || !currentUserId || !content.trim()) return;

    this.messageService
      .sendMessage({
        conversationId,
        senderId: currentUserId,
        content,
      })
      .subscribe({
        next: (message) => {
          this.messages.update((list) => [...list, toMessageItem(message, currentUserId)]);
        },
        error: () => {
          this.flashMessage.error('Không thể gửi tin nhắn, thử lại sau.');
        },
      });
  }
}
