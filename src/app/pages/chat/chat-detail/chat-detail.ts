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
      this.messages.set(id ? (MOCK_MESSAGES[id] ?? []) : []);
    });
  }

  toggleInfoPanel() {
    this.showInfoPanel.update((v) => !v);
  }

  onSendMessage(content: string) {
    this.messages.update((list) => [
      ...list,
      {
        id: crypto.randomUUID(),
        content,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isMine: true,
      },
    ]);
  }
}
