// message-bubble.ts
import { Component, computed, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { MessageType } from '@app/core/enums/message.enum';
import { MessageAttachment } from '@app/core/model/message/message.model';
import { LucideAngularModule } from "lucide-angular";

export type MessageAction = 'reply' | 'edit' | 'delete';

@Component({
  selector: 'app-message-bubble',
  templateUrl: './message-bubble.html',
  host: { class: 'block' },
  imports: [LucideAngularModule],
})
export class MessageBubble {
  id = input.required<string>();
  content = input('');
  time = input('');
  isMine = input(false);
  showHeader = input(true);
  senderName = input<string | null>(null);
  type = input<MessageType>(MessageType.Text);
  attachments = input<MessageAttachment[]>([]);
  isDeleted = input(false);
  editedAt = input<string | null>(null);
  replyPreview = input<string | null>(null);

  action = output<MessageAction>();

  protected readonly MessageType = MessageType;
  showMenu = signal(false);
  openUpward = signal(false);

  private menuButton = viewChild<ElementRef<HTMLButtonElement>>('menuButton');

  protected readonly bubbleClasses = computed(() =>
    this.isMine() ? 'ml-auto bg-primary-main text-white' : 'mr-auto bg-bg-hover text-text-heading',
  );

  protected readonly wrapperClasses = computed(() => (this.isMine() ? 'items-end' : 'items-start'));

  protected readonly formattedSize = computed(() => {
    const size = this.attachments()[0]?.fileSize ?? 0;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  });

  toggleMenu() {
    const willOpen = !this.showMenu();

    if (willOpen) {
      const rect = this.menuButton()?.nativeElement.getBoundingClientRect();
      this.openUpward.set(!!rect && rect.bottom + 220 > window.innerHeight);
    }

    this.showMenu.set(willOpen);
  }

  selectAction(action: MessageAction){
    this.showMenu.set(false);
    this.action.emit(action);
  }
}
