// message-bubble.ts
import { Component, computed, input } from '@angular/core';
import { MessageType } from '@app/core/enums/message.enum';
import { MessageAttachment } from '@app/core/model/message/message.model';
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: 'app-message-bubble',
  templateUrl: './message-bubble.html',
  host: { class: 'block' },
  imports: [LucideAngularModule],
})
export class MessageBubble {
  content = input('');
  time = input('');
  isMine = input(false);
  showHeader = input(true);
  senderName = input<string | null>(null);
  type = input<MessageType>(MessageType.Text);
  attachments = input<MessageAttachment[]>([]);

  protected readonly MessageType = MessageType;

  protected readonly bubbleClasses = computed(() =>
    this.isMine() ? 'ml-auto bg-primary text-white' : 'mr-auto bg-dark-surface text-dark-text',
  );

  protected readonly wrapperClasses = computed(() => (this.isMine() ? 'items-end' : 'items-start'));

  protected readonly formattedSize = computed(() => {
    const size = this.attachments()[0]?.fileSize ?? 0;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  });
}
