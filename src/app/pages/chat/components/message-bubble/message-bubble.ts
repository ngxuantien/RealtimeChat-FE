// message-bubble.ts
import { Component, computed, input } from "@angular/core";

@Component({
    selector: 'app-message-bubble',
    templateUrl: './message-bubble.html',
    host: { class: 'block' }
})
export class MessageBubble {
    content = input('');
    time = input('');
    isMine = input(false);

    protected readonly bubbleClasses = computed(() =>
        this.isMine()
            ? 'ml-auto bg-primary text-white'
            : 'mr-auto bg-dark-surface text-dark-text'
    );

    protected readonly wrapperClasses = computed(() =>
        this.isMine() ? 'items-end' : 'items-start'
    );
}