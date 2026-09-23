import { Component, effect, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, map, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ConversationMember } from '@app/core/model/conversation/conversation-member.model';
import { MessageService } from '@app/core/service/message.service';
import { AuthService } from '@app/core/service/auth.service';

export interface SearchResultItem {
    id: string;
    content: string;
    time: string;
    senderId: string;
    isMine: boolean;
}

@Component({
    selector: 'app-chat-search-panel',
    imports: [FormsModule, LucideAngularModule],
    templateUrl: './chat-search-panel.html',
})
export class ChatSearchPanel {
    private messageService = inject(MessageService);
    private authService = inject(AuthService);

    conversationId = input.required<string>();
    members = input<ConversationMember[]>([]);
    close = output<void>();
    jumpTo = output<string>();

    keyword = signal('');
    isSearching = signal(false);
    results = signal<SearchResultItem[]>([]);

    constructor() {
        effect(() => {
            this.conversationId();
            this.keyword.set('');
            this.results.set([]);
            this.isSearching.set(false);
        });

        toObservable(this.keyword)
            .pipe(
                map((k) => k.trim()),
                distinctUntilChanged(),
                debounceTime(300),
                switchMap((term) => {
                    if (!term) {
                        this.isSearching.set(false);
                        this.results.set([]);
                        return EMPTY;
                    }
                    this.isSearching.set(true);
                    return this.messageService.searchMessages(this.conversationId(), term).pipe(
                        catchError(() => {
                            this.isSearching.set(false);
                            this.results.set([]);
                            return EMPTY;
                        }),
                    );
                }),
                takeUntilDestroyed(),
            )
            .subscribe((messages) => {
                this.isSearching.set(false);
                const currentUserId = this.authService.currentUser()?.userId;

                this.results.set(
                    messages.map((m) => ({
                        id: m.id,
                        content: m.content,
                        time: new Date(m.createdAt).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                        }),
                        senderId: m.senderId,
                        isMine: m.senderId === currentUserId,
                    })),
                );
            });
    }

    senderName(senderId: string): string {
        return this.members().find((m) => m.userId === senderId)?.displayName ?? 'Người dùng';
    }
}
