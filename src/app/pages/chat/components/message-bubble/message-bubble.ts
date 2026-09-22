// message-bubble.ts
import { Component, computed, ElementRef, HostListener, inject, input, output, signal, viewChild } from '@angular/core';
import { MessageType } from '@app/core/enums/message.enum';
import { MessageAttachment, MessageReaction } from '@app/core/model/message/message.model';
import { LucideAngularModule } from "lucide-angular";

export type MessageAction = 'reply' | 'edit' | 'delete';

export interface ReactionGroup {
  emoji: string;
  count: number;
  mine: boolean;
}

const QUICK_REACTIONS = ['👍', '❤️', '😆', '😮', '😢', '🙏'];

@Component({
  selector: 'app-message-bubble',
  templateUrl: './message-bubble.html',
  host: { class: 'block' },
  imports: [LucideAngularModule],
})
export class MessageBubble {
  private elementRef = inject(ElementRef);

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
  seen = input(false);
  reactions = input<MessageReaction[]>([]);
  myReactionEmoji = input<string | null>(null);

  action = output<MessageAction>();
  toggleReaction = output<string>();

  protected readonly MessageType = MessageType;
  protected readonly quickReactions = QUICK_REACTIONS;
  showMenu = signal(false);
  openUpward = signal(false);
  showReactionPicker = signal(false);

  protected readonly reactionGroups = computed<ReactionGroup[]>(() => {
    const counts = new Map<string, number>();
    for (const r of this.reactions()) {
      counts.set(r.emoji, (counts.get(r.emoji) ?? 0) + 1);
    }
    const mine = this.myReactionEmoji();
    return Array.from(counts.entries()).map(([emoji, count]) => ({
      emoji,
      count,
      mine: emoji === mine,
    }));
  });

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

  toggleReactionPicker() {
    this.showReactionPicker.update((v) => !v);
  }

  pickReaction(emoji: string) {
    this.showReactionPicker.set(false);
    this.toggleReaction.emit(emoji);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent){
    if(!this.showMenu() && !this.showReactionPicker()) return;

    if(!this.elementRef.nativeElement.contains(event.target)){
      this.showMenu.set(false);
      this.showReactionPicker.set(false);
    }
  }
}
