// chat-header.ts
import { Component, computed, input, output } from "@angular/core";
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { ConversationType } from "@app/core/enums/conversation.enum";

@Component({
    selector: 'app-chat-header',
    imports: [LucideAngularModule, RouterLink],
    templateUrl: './chat-header.html',
    host: { class: 'shrink-0' },
})
export class ChatHeader {
    name = input('');
    avatarUrl = input<string | null>(null);
    isOnline = input(false);
    isGroup = input(false);
    memberCount = input(0);

    toggleInfo = output<void>();
}