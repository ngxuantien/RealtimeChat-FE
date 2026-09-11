// chat-detail.ts
import { Component, DestroyRef, HostListener, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { ChatWindow } from '@app/pages/chat/components/chat-window/chat-window';
import { InfoPanel } from '@app/pages/chat/components/info-panel/info-panel';
import { Message } from '@app/core/model/message/message.model';
import { AuthService } from '@app/core/service/auth.service';
import { ConversationService } from '@app/core/service/conversation.service';
import { MessageService } from '@app/core/service/message.service';
import { FlashMessageService } from '@app/core/service/common/flash-message.service';
import { SignalRService } from '@app/core/service/common/signalr.service';
import {
  ConversationListItem,
  toConversationListItem,
} from '@app/core/utils/conversation-display.util';
import { toMessageItems } from '@app/core/utils/message-display.util';
import { ConversationMember } from '@app/core/model/conversation/conversation-member.model';
import { ConversationType } from '@app/core/enums/conversation.enum';
import {
  AttachmentBatchPayload,
  EditTarget,
  ReplyTarget,
} from '../components/chat-input-bar/chat-input-bar';
import { MessageAction } from '../components/message-bubble/message-bubble';
import { MessageItem } from '../components/message-list/message-list';
import { Upload } from 'lucide-angular';
import { ChatSearchPanel } from '../components/chat-search-panel/chat-search-panel';
import { ConfirmModal } from '@app/share/component/confirm-modal/confirm-modal';

@Component({
  selector: 'app-chat-detail',
  imports: [ChatWindow, InfoPanel, ChatSearchPanel, ConfirmModal],
  templateUrl: './chat-detail.html',
  host: { class: 'flex min-h-0 flex-1' },
})
export class ChatDetail {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private conversationService = inject(ConversationService);
  private messageService = inject(MessageService);
  private flashMessage = inject(FlashMessageService);
  private signalRService = inject(SignalRService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  showInfoPanel = signal(window.matchMedia('(min-width: 1024px)').matches);

  conversationId = toSignal(this.route.paramMap.pipe(map((p) => p.get('conversationId')!)));

  conversation = signal<ConversationListItem | null>(null);
  members = signal<ConversationMember[]>([]);
  isGroupConversation = signal(false);
  rawMessages = signal<Message[]>([]);
  replyTarget = signal<ReplyTarget | null>(null);
  editTarget = signal<EditTarget | null>(null);

  pendingDeleteMessageId = signal<string | null>(null);
  showDeleteHistoryConfirm = signal(false);

  messages = computed(() =>
    toMessageItems(
      this.rawMessages(),
      this.authService.currentUser()?.userId ?? '',
      this.members(),
      this.isGroupConversation(),
    ),
  );

  private joinedConversationId: string | null = null;

  constructor() {
    this.signalRService.onReconnected.pipe(takeUntilDestroyed()).subscribe(() => {
      const id = this.conversationId();
      if (id) this.signalRService.joinConversation(id);
    });

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
            this.conversationService.getMembers(id).pipe(map((members) => ({ conv, members }))),
          ),
        )
        .subscribe(({ conv, members }) => {
          this.conversation.set(toConversationListItem(conv, members, currentUserId));
          this.members.set(members);
          this.isGroupConversation.set(conv.type === ConversationType.Group);
        });
    });

    effect(() => {
      const id = this.conversationId();
      const currentUserId = this.authService.currentUser()?.userId;

      if (!id || !currentUserId) {
        this.rawMessages.set([]);
        return;
      }

      this.messageService.getMessages(id).subscribe((list) => {
        const ordered = [...list].reverse();
        this.rawMessages.set([...list].reverse());

        const lastMessage = ordered.at(-1);
        if (lastMessage) this.markConversationAsRead(lastMessage.id);
      });

      if (this.joinedConversationId && this.joinedConversationId !== id) {
        this.signalRService.leaveConversation(this.joinedConversationId);
      }
      this.signalRService.joinConversation(id);
      this.joinedConversationId = id;
    });

    this.signalRService.onMessageReceived.pipe(takeUntilDestroyed()).subscribe((message) => {
      if (message.conversationId !== this.conversationId()) return;
      this.appendMessage(message);
    });

    this.signalRService.onUserOnlineStatusChanged
      .pipe(takeUntilDestroyed())
      .subscribe(({ userId, isOnline }) => {
        this.conversation.update((c) => (c && c.otherUserId === userId ? { ...c, isOnline } : c));
      });

    this.signalRService.onMessageEdited.pipe(takeUntilDestroyed()).subscribe((message) => {
      if (message.conversationId !== this.conversationId()) return;
      this.replaceMessage(message);
    });

    this.signalRService.onMessageDeleted
      .pipe(takeUntilDestroyed())
      .subscribe(({ messageId, conversationId }) => {
        if (conversationId !== this.conversationId()) return;
        this.removeMessageLocally(messageId);
      });

    this.signalRService.onMessageRead
      .pipe(takeUntilDestroyed())
      .subscribe(({ conversationId, userId, lastReadMessageId }) => {
        if (conversationId !== this.conversationId()) return;
        this.members.update((list) =>
          list.map((m) => (m.userId === userId ? { ...m, lastReadMessageId } : m)),
        );
      });

    this.destroyRef.onDestroy(() => {
      if (this.joinedConversationId) {
        this.signalRService.leaveConversation(this.joinedConversationId);
      }
    });
  }

  sidePanelMode = signal<'files' | 'search' | null>(
    window.matchMedia('(min-width: 1024px)').matches ? 'files' : null,
  );

  isMuted = computed(() => {
    const currentUserId = this.authService.currentUser()?.userId;
    return this.members().find((m) => m.userId === currentUserId)?.isMuted ?? false;
  });

  toggleInfoPanel() {
    this.sidePanelMode.update((mode) => (mode === 'files' ? null : 'files'));
  }

  toggleSearchPanel() {
    this.sidePanelMode.update((mode) => (mode === 'search' ? null : 'search'));
  }

  onToggleMute() {
    const conversationId = this.conversationId();
    if (!conversationId) return;

    this.conversationService.updateMute(conversationId, !this.isMuted()).subscribe({
      next: () => {
        this.members.update((list) =>
          list.map((m) =>
            m.userId === this.authService.currentUser()?.userId
              ? { ...m, isMuted: !this.isMuted() }
              : m,
          ),
        );
      },
      error: () => this.flashMessage.error('Không thể cập nhật thông báo, thử lại sau.'),
    });
  }

  onDeleteHistory() {
    this.showDeleteHistoryConfirm.set(true);
  }

  confirmDeleteHistory() {
    this.showDeleteHistoryConfirm.set(false);
    const conversationId = this.conversationId();
    const currentUserId = this.authService.currentUser()?.userId;
    if (!conversationId || !currentUserId) return;

    this.conversationService.deleteConversation(conversationId, currentUserId).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: () => this.flashMessage.error('Không thể xóa lịch sử trò chuyện, thử lại sau.'),
    });
  }

  onJumpToMessage(messageId: string) {
    this.sidePanelMode.set(null);
    setTimeout(() => {
      document
        .getElementById(`message-${messageId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }

  onSendMessage(content: string) {
    const conversationId = this.conversationId();
    const currentUserId = this.authService.currentUser()?.userId;

    if (!conversationId || !currentUserId || !content.trim()) return;

    const replyToMessageId = this.replyTarget()?.id ?? null;

    this.messageService
      .sendMessage({ conversationId, senderId: currentUserId, content, replyToMessageId })
      .subscribe({
        next: (message) => {
          (this.appendMessage(message), this.replyTarget.set(null));
        },
        error: () => this.flashMessage.error('Không thể gửi tin nhắn, thử lại sau.'),
      });
  }

  onSendAttachment({ files, caption }: AttachmentBatchPayload) {
    const conversationId = this.conversationId();
    const currentUserId = this.authService.currentUser()?.userId;
    if (!conversationId || !currentUserId || files.length === 0) return;

    files.forEach(({ file, type }, index) => {
      this.messageService.uploadAttachment(file).subscribe({
        next: (attachment) => {
          this.messageService
            .sendMessage({
              conversationId,
              senderId: currentUserId,
              content: index === 0 ? (caption ?? '') : '',
              type,
              attachments: [attachment],
            })
            .subscribe({
              next: (message) => this.appendMessage(message),
              error: () => this.flashMessage.error('Không thể gửi tệp, thử lại sau'),
            });
        },
        error: () => this.flashMessage.error('Không thể tải lên tệp, thử lại sau'),
      });
    });
  }

  onMessageAction({ action, message }: { action: MessageAction; message: MessageItem }) {
    switch (action) {
      case 'reply':
        this.editTarget.set(null);
        this.replyTarget.set({ id: message.id, preview: message.content || 'Tệp đính kèm' });
        break;
      case 'edit':
        this.replyTarget.set(null);
        this.editTarget.set({ id: message.id, content: message.content });
        break;
      case 'delete':
        this.pendingDeleteMessageId.set(message.id);
        break;
    }
  }

  onSaveEdit({ id, content }: { id: string; content: string }) {
    const currentUserId = this.authService.currentUser()?.userId;
    if (!currentUserId) return;

    this.messageService.editMessage(id, currentUserId, content).subscribe({
      next: (updated) => this.replaceMessage(updated),
      error: () => this.flashMessage.error('Không thể sửa tin nhắn, thử lại sau.'),
    });
    this.editTarget.set(null);
  }

  confirmDeleteMessage() {
    const messageId = this.pendingDeleteMessageId();
    const currentUserId = this.authService.currentUser()?.userId;
    this.pendingDeleteMessageId.set(null);
    if (!messageId || !currentUserId) return;

    this.messageService.deleteMessage(messageId, currentUserId).subscribe({
      next: () => this.removeMessageLocally(messageId),
      error: () => this.flashMessage.error('Không thể xóa tin nhắn, thử lại sau.'),
    });
  }

  private removeMessageLocally(messageId: string) {
    this.rawMessages.update((list) => list.filter((m) => m.id !== messageId));
  }

  private replaceMessage(updated: Message) {
    this.rawMessages.update((list) => list.map((m) => (m.id === updated.id ? updated : m)));
  }

  private appendMessage(message: Message) {
    this.rawMessages.update((list) =>
      list.some((m) => m.id === message.id) ? list : [...list, message],
    );
    this.markConversationAsRead(message.id);
  }

  private markConversationAsRead(messageId: string) {
    const id = this.conversationId();
    const currentUserId = this.authService.currentUser()?.userId;
    if (!id || !currentUserId) return;

    this.conversationService.markAsRead(id, currentUserId, messageId).subscribe();
  }

  onMembersChanged() {
    const id = this.conversationId();
    if (!id) return;
    this.conversationService.getMembers(id).subscribe((members) => this.members.set(members));
  }

  onLeftGroupOrDeleted() {
    this.sidePanelMode.set(null);
    this.router.navigateByUrl('/');
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (!window.matchMedia('(min-width: 1024px)').matches) {
      this.sidePanelMode.set(null);
    }
  }
}
