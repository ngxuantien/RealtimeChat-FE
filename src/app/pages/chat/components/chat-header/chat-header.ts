// chat-header.ts
import { Component, input, output } from "@angular/core";
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';

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

    toggleInfo = output<void>();
}