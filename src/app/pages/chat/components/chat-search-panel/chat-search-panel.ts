import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { MessageItem } from '@app/pages/chat/components/message-list/message-list';

@Component({
    selector: 'app-chat-search-panel',
    imports: [FormsModule, LucideAngularModule],
    templateUrl: './chat-search-panel.html',
})
export class ChatSearchPanel {
    messages = input<MessageItem[]>([]);
    close = output<void>();
    jumpTo = output<string>();

    keyword = signal('');

    results = computed(() => {
        const term = this.keyword().trim().toLowerCase();
        if (!term) return [];

        return this.messages()
            .filter((m) => !m.isDeleted && m.content.toLowerCase().includes(term))
            .slice()
            .reverse();
    });
}