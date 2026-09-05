import { Component, effect, inject, input, output, signal } from '@angular/core';
import { MessageType } from '@app/core/enums/message.enum';
import { ConversationMember } from '@app/core/model/conversation/conversation-member.model';
import { Message } from '@app/core/model/message/message.model';
import { MessageService } from '@app/core/service/message.service';
import { formatConversationTime } from '@app/core/utils/format-time.util';
import { LucideAngularModule } from "lucide-angular";

@Component({
    selector: 'app-info-panel',
    templateUrl: './info-panel.html',
    imports: [LucideAngularModule],
})
export class InfoPanel {
    private messageService = inject(MessageService);

    protected readonly MessageType = MessageType;

    conversationId = input<string | null>(null);
    members = input<ConversationMember[]>([]);
    close = output<void>();

    attachments = signal<Message[]>([]);
    isLoading = signal(false);

    constructor(){
        effect(() => {
            const id = this.conversationId();
            if(!id){
                this.attachments.set([]);
                return;
            }

            this.isLoading.set(true);
            this.messageService.getAttachments(id).subscribe({
                next: (message) => {
                    this.isLoading.set(false);
                    this.attachments.set(message);
                },
                error: () => this.isLoading.set(false),
            });
        });
    }

    senderName(senderId: string): string{
        return this.members().find((m) => m.userId == senderId)?.displayName ?? 'Người dùng';
    }

    formatDate(iso: string) : string{
        return formatConversationTime(iso);
    }
}