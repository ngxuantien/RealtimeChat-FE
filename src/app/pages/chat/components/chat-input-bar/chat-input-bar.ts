// chat-input-bar.ts
import { Component, output, signal } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-chat-input-bar',
    imports: [FormsModule, LucideAngularModule],
    templateUrl: './chat-input-bar.html',
    host: { class: 'shrink-0' },
})
export class ChatInputBar {
    message = signal('');
    send = output<string>();

    onSend() {
        const value = this.message().trim();
        if (!value) return;
        this.send.emit(value);
        this.message.set('');
    }
}