import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-chat-empty',
    imports: [LucideAngularModule],
    templateUrl: './chat-empty.html',
    host: { class: 'flex min-h-0 flex-1' },
})
export class ChatEmpty {}