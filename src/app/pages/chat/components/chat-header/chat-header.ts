// chat-header.ts
import { Component, input, output } from "@angular/core";
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-chat-header',
    imports: [LucideAngularModule],
    templateUrl: './chat-header.html',
    host: { class: 'shrink-0' },
})
export class ChatHeader {
    name = input('');
    avatarUrl = input<string | null>(null);
    isOnline = input(false);

    toggleInfo = output<void>();
}