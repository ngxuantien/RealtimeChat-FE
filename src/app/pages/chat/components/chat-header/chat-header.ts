// chat-header.ts
import { Component, computed, ElementRef, HostListener, inject, input, output, signal } from "@angular/core";
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { ConversationType } from "@app/core/enums/conversation.enum";

@Component({
    selector: 'app-chat-header',
    imports: [LucideAngularModule, RouterLink],
    templateUrl: './chat-header.html',
    host: { class: 'shrink-0' },
})
export class ChatHeader {
    private elementRef = inject(ElementRef);
    
    name = input('');
    avatarUrl = input<string | null>(null);
    isOnline = input(false);
    isGroup = input(false);
    memberCount = input(0);
    isMuted = input(false);

    toggleInfo = output<void>();
    toggleSearch = output<void>();
    toggleMute = output<void>();
    deleteHistory = output<void>();

    showMoreMenu = signal(false);

    toggleMoreMenu(){
        this.showMoreMenu.update((v) => !v);
    }

    onToggleMute(){
        this.showMoreMenu.set(false);
        this.toggleMute.emit();
    }

    onDeleteHistory(){
        this.showMoreMenu.set(false);
        this.deleteHistory.emit();
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent){
        if(!this.showMoreMenu()) return;

        if(!this.elementRef.nativeElement.contains(event.target)){
            this.showMoreMenu.set(false);
        }
    }
}