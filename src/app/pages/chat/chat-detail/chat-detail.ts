// pages/chat/chat-detail/chat-detail.ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
    selector: 'app-chat-detail',
    imports: [],
    templateUrl: './chat-detail.html',
})
export class ChatDetail {
    private route = inject(ActivatedRoute);
    conversationId = toSignal(
        this.route.paramMap.pipe(map(p => p.get('conversationId')!))
    );
}   