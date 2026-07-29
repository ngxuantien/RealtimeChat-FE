import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CONVERSATIONS } from '@app/pages/chat/mock-data';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  imports: [LucideAngularModule, FormsModule, RouterLink, RouterLinkActive],
})
export class Sidebar {
    activeTab = signal<'message' | 'group'>('message');
    searchTerm = signal('');

    conversations = signal(CONVERSATIONS);

    get pinnedConversations() {
        return this.conversations().filter(c => c.isPinned);
    }

    get allConversations() {
        return this.conversations().filter(c => !c.isPinned);
    }

    setTab(tab: 'message' | 'group') {
        this.activeTab.set(tab);
    }
}