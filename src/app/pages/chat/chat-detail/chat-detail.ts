// chat-detail.ts
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ChatWindow } from '@app/pages/chat/components/chat-window/chat-window';
import { InfoPanel } from '@app/pages/chat/components/info-panel/info-panel';
import { MessageItem } from '@app/pages/chat/components/message-list/message-list';
import { CONVERSATIONS, MOCK_MESSAGES } from '@app/pages/chat/mock-data';

@Component({
    selector: 'app-chat-detail',
    imports: [ChatWindow, InfoPanel],
    templateUrl: './chat-detail.html',
    host: { class: 'flex min-h-0 flex-1' },
})
export class ChatDetail {
    private route = inject(ActivatedRoute);
    conversationId = toSignal(
        this.route.paramMap.pipe(map(p => p.get('conversationId')!))
    );

    conversation = computed(() => CONVERSATIONS.find(c => c.id === this.conversationId()) ?? null);

    messages = signal<MessageItem[]>([]);
    showInfoPanel = signal(true);

    constructor() {
        effect(() => {
            const id = this.conversationId();
            this.messages.set(id ? (MOCK_MESSAGES[id] ?? []) : []);
        });
    }

    toggleInfoPanel() {
        this.showInfoPanel.update(v => !v);
    }

    onSendMessage(content: string) {
        this.messages.update(list => [
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