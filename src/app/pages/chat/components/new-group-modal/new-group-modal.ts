import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '@app/core/service/auth.service';
import { ConversationService } from '@app/core/service/conversation.service';
import { ConversationListItem } from '@app/core/utils/conversation-display.util';

export interface Contact {
    userId: string;
    name: string;
    avatarUrl: string | null;
}

@Component({
    selector: 'app-new-group-modal',
    imports: [FormsModule, LucideAngularModule],
    templateUrl: './new-group-modal.html',
})
export class NewGroupModal {
    private authService = inject(AuthService);
    private conversationService = inject(ConversationService);
    private router = inject(Router);

    conversations = input<ConversationListItem[]>([]);

    close = output<void>();
    created = output<void>();

    groupName = signal('');
    searchTerm = signal('');
    selectedUserIds = signal<ReadonlySet<string>>(new Set());
    isCreating = signal(false);
    errorMessage = signal('');

    contacts = computed<Contact[]>(() => {
        const seen = new Set<string>();
        const list: Contact[] = [];

        for (const c of this.conversations()) {
            if (!c.otherUserId || seen.has(c.otherUserId)) continue;
            seen.add(c.otherUserId);
            list.push({ userId: c.otherUserId, name: c.name, avatarUrl: c.avatarUrl });
        }

        return list;
    });

    filteredContacts = computed(() => {
        const term = this.searchTerm().trim().toLowerCase();
        if (!term) return this.contacts();
        return this.contacts().filter((c) => c.name.toLowerCase().includes(term));
    });

    toggleMember(userId: string) {
        this.selectedUserIds.update((prev) => {
            const next = new Set(prev);
            if (next.has(userId)) next.delete(userId);
            else next.add(userId);
            return next;
        });
    }

    createGroup() {
        this.errorMessage.set('');

        const name = this.groupName().trim();
        if (!name) {
            this.errorMessage.set('Vui lòng nhập tên nhóm.');
            return;
        }

        if (this.selectedUserIds().size === 0) {
            this.errorMessage.set('Chọn ít nhất 1 người để thêm vào nhóm.');
            return;
        }

        const currentUserId = this.authService.currentUser()?.userId;
        if (!currentUserId) return;

        this.isCreating.set(true);

        this.conversationService
            .createGroupConversation({
                createdByUserId: currentUserId,
                name,
                memberIds: Array.from(this.selectedUserIds()),
            })
            .subscribe({
                next: (conversation) => {
                    this.isCreating.set(false);
                    this.created.emit();
                    this.close.emit();
                    this.router.navigate(['/chat', conversation.id]);
                },
                error: () => {
                    this.isCreating.set(false);
                    this.errorMessage.set('Không thể tạo nhóm, thử lại sau.');
                },
            });
    }
}
