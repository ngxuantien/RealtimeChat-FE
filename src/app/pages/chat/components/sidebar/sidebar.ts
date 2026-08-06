import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeService } from '@app/core/service/theme.service';
import { AuthService } from '@app/core/service/auth.service';
import { UserService } from '@app/core/service/user.service';
import { ConversationService } from '@app/core/service/conversation.service';
import { forkJoin, map, of, switchMap } from 'rxjs';
import {
  ConversationListItem,
  toConversationListItem,
} from '@app/core/utils/conversation-display.util';
import { User } from '@app/core/model/user/user.model';
import { NewConversationModal } from "../new-conversation-modal/new-conversation-modal";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  imports: [LucideAngularModule, FormsModule, RouterLink, RouterLinkActive, NewConversationModal],
})
export class Sidebar {
  protected readonly themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private conversationService = inject(ConversationService);
  private router = inject(Router);

  activeTab = signal<'message' | 'group'>('message');
  searchTerm = signal('');

  showNewConversationModal = signal(false);

  currentUserProfile = signal<User | null>(null);
  conversations = signal<ConversationListItem[]>([]);

  get pinnedConversations() {
    return this.conversations().filter((c) => c.isPinned);
  }

  constructor() {
    const userId = this.authService.currentUser()?.userId;
    if (!userId) return;

    this.userService.getById(userId).subscribe((user) => this.currentUserProfile.set(user));
    this.loadConversations(userId);
  }

  get allConversations() {
    return this.conversations().filter((c) => !c.isPinned);
  }

  setTab(tab: 'message' | 'group') {
    this.activeTab.set(tab);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private loadConversations(currentUserId: string) {
    this.conversationService
      .getUserConversations(currentUserId)
      .pipe(
        switchMap((conversations) => {
          if (conversations.length === 0) return of([]);

          const requests = conversations.map((conv) =>
            forkJoin({
              members: this.conversationService.getMembers(conv.id),
              unread: this.conversationService.getUnreadCount(conv.id, currentUserId),
            }).pipe(
              map(({ members, unread }) =>
                toConversationListItem(conv, members, currentUserId, unread.unreadCount),
              ),
            ),
          );

          return forkJoin(requests);
        }),
      )
      .subscribe((items) => this.conversations.set(items));
  }

  onConversationCreated() {
        const userId = this.authService.currentUser()?.userId;
        if (userId) this.loadConversations(userId);
    }
}
