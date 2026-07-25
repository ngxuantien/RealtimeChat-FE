// chat-header.ts
import { Component, input, output } from "@angular/core";
import { LucideSearch, LucidePhone, LucideVideo, LucideInfo, LucideEllipsis } from '@lucide/angular';

@Component({
    selector: 'app-chat-header',
    imports: [LucideSearch, LucidePhone, LucideVideo, LucideInfo, LucideEllipsis],
    templateUrl: './chat-header.html',
})
export class ChatHeader {
    name = input('');
    avatarUrl = input<string | null>(null);
    isOnline = input(false);

    toggleInfo = output<void>();
}