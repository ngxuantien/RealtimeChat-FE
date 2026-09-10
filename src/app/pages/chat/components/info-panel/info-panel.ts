import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageType } from '@app/core/enums/message.enum';
import { ConversationMember } from '@app/core/model/conversation/conversation-member.model';
import { Message } from '@app/core/model/message/message.model';
import { User } from '@app/core/model/user/user.model';
import { AuthService } from '@app/core/service/auth.service';
import { FlashMessageService } from '@app/core/service/common/flash-message.service';
import { ConversationService } from '@app/core/service/conversation.service';
import { MessageService } from '@app/core/service/message.service';
import { UserService } from '@app/core/service/user.service';
import { formatConversationTime } from '@app/core/utils/format-time.util';
import { isValidPhoneNumber, sanitizePhoneInput } from '@app/core/utils/phone.util';
import { LucideAngularModule } from 'lucide-angular';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { ConfirmModal } from "@app/share/component/confirm-modal/confirm-modal";

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.html',
  imports: [FormsModule, LucideAngularModule, ConfirmModal],
})
export class InfoPanel {
  private messageService = inject(MessageService);
  private conversationService = inject(ConversationService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private flashMessage = inject(FlashMessageService);

  protected readonly MessageType = MessageType;

  conversationId = input<string | null>(null);
  members = input<ConversationMember[]>([]);
  isGroup = input(false);
  createdBy = input<string | null>(null);

  close = output<void>();
  memberRemoved = output<void>();
  memberAdded = output<void>();
  leftGroup = output<void>();
  groupDeleted = output<void>();

  currentUserId = computed(() => this.authService.currentUser()?.userId ?? '');
  isCreator = computed(() => !!this.createdBy() && this.createdBy() === this.currentUserId());

  attachments = signal<Message[]>([]);
  isLoading = signal(false);

  showAllMembers = signal(false);
  showAddMember = signal(false);
  addMemberPhone = signal('');
  addMemberError = signal('');
  foundUserToAdd = signal<User | null>(null);
  isSearchingUser = signal(false);
  isAddingMember = signal(false);

  pendingRemoveMemberId = signal<string | null>(null);
  showLeaveConfirm = signal(false);
  showDeleteGroupConfirm = signal(false);

  private addMemberSearch$ = new Subject<string>();

  constructor() {
    effect(() => {
      const id = this.conversationId();
      if (!id) {
        this.attachments.set([]);
        return;
      }

      this.isLoading.set(true);
      this.messageService.getAttachments(id).subscribe({
        next: (message) => {
          this.isLoading.set(false);
          this.attachments.set(message);
        },
        error: () => this.isLoading.set(false),
      });
    });

    this.addMemberSearch$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter((phone) => isValidPhoneNumber(phone)),
        switchMap((phone) => {
          this.isSearchingUser.set(true);
          return this.userService.getByPhone(phone).pipe(
            catchError(() => {
              this.addMemberError.set('Không tìm thấy người dùng với số điện thoại này.');
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((user) => {
        this.isSearchingUser.set(false);
        if (!user) return;

        if (this.members().some((m) => m.userId === user.id)) {
          this.addMemberError.set('Người này đã ở trong nhóm.');
          return;
        }

        this.foundUserToAdd.set(user);
      });
  }

  senderName(senderId: string): string {
    return this.members().find((m) => m.userId === senderId)?.displayName ?? 'Người dùng';
  }

  formatDate(iso: string): string {
    return formatConversationTime(iso);
  }

  onAddMemberPhoneChange(value: string) {
    const sanitized = sanitizePhoneInput(value);
    this.addMemberPhone.set(sanitized);
    this.foundUserToAdd.set(null);
    this.addMemberError.set('');

    if (sanitized.length === 0) return;
    this.addMemberSearch$.next(sanitized);
  }

  closeAddMember() {
    this.showAddMember.set(false);
    this.addMemberPhone.set('');
    this.foundUserToAdd.set(null);
    this.addMemberError.set('');
  }

  confirmAddMember(user: User) {
    const conversationId = this.conversationId();
    if (!conversationId) return;

    this.isAddingMember.set(true);
    this.conversationService.addMember(conversationId, user.id).subscribe({
      next: () => {
        this.isAddingMember.set(false);
        this.flashMessage.success('Thêm thành viên thành công');
        this.memberAdded.emit();
        this.closeAddMember();
      },
      error: () => {
        this.isAddingMember.set(false);
        this.flashMessage.error('Không thể thêm thành viên, thử lại sau');
      },
    });
  }

  confirmRemoveMember(userId: string) {
    this.pendingRemoveMemberId.set(null);
    const conversationId = this.conversationId();
    if (!conversationId) return;

    this.conversationService.removeMember(conversationId, userId).subscribe({
      next: () => {
        this.flashMessage.success('Xóa thành viên thành công');
        this.memberRemoved.emit();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 403) {
          this.flashMessage.error('Bạn không có quyền xóa thành viên này');
        } else {
          this.flashMessage.error('Không thể xóa thành viên, thử lại sau');
        }
      },
    });
  }

  confirmLeaveGroup() {
    this.showLeaveConfirm.set(false);
    const conversationId = this.conversationId();
    if (!conversationId) return;

    this.conversationService.leaveConversation(conversationId, this.currentUserId()).subscribe({
      next: () => this.leftGroup.emit(),
      error: () => this.flashMessage.error('Không thể rời nhóm, thử lại sau'),
    });
  }

  confirmDeleteGroup() {
    this.showDeleteGroupConfirm.set(false);
    const conversationId = this.conversationId();
    if (!conversationId) return;

    this.conversationService.deleteGroup(conversationId).subscribe({
      next: () => this.groupDeleted.emit(),
      error: (err: HttpErrorResponse) => {
        if (err.status === 403) {
          this.flashMessage.error('Chỉ trưởng nhóm mới có thể xóa nhóm');
        } else {
          this.flashMessage.error('Không thể xóa nhóm, thử lại sau');
        }
      },
    });
  }
}
