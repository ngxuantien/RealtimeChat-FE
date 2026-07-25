// chat-detail.ts
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ChatWindow } from '@app/pages/chat/components/chat-window/chat-window';
import { InfoPanel } from '@app/pages/chat/components/info-panel/info-panel';

@Component({
    selector: 'app-chat-detail',
    imports: [ChatWindow, InfoPanel],
    templateUrl: './chat-detail.html',
})
export class ChatDetail {
    private route = inject(ActivatedRoute);
    conversationId = toSignal(
        this.route.paramMap.pipe(map(p => p.get('conversationId')!))
    );

    showInfoPanel = signal(true);
}