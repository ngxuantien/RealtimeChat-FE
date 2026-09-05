import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeService } from '@app/core/service/theme.service';
import { AuthService } from '@app/core/service/auth.service';
import { UserService } from '@app/core/service/user.service';
import { ConversationService } from '@app/core/service/conversation.service';
import { filter, forkJoin, map, of, switchMap } from 'rxjs';
import {
  ConversationListItem,
  toConversationListItem,
} from '@app/core/utils/conversation-display.util';
import { User } from '@app/core/model/user/user.model';
import { NewConversationModal } from '../new-conversation-modal/new-conversation-modal';
import { NewGroupModal } from '../new-group-modal/new-group-modal';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ConfirmModal } from '@app/share/component/confirm-modal/confirm-modal';
import { SignalRService } from '@app/core/service/common/signalr.service';
import { formatConversationTime } from '@app/core/utils/format-time.util';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  imports: [
    LucideAngularModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    NewConversationModal,
    NewGroupModal,
    ConfirmModal,
  ],
})
export class Sidebar {
  protected readonly themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private conversationService = inject(ConversationService);
  private signalRService = inject(SignalRService);
  private router = inject(Router);
  private readonly readConversationIds = signal<ReadonlySet<string>>(new Set());

  activeTab = signal<'message' | 'group'>('message');
  searchTerm = signal('');
  searchFocused = signal(false);

  showLogoutConfirm = signal(false);

  showNewConversationModal = signal(false);
  showNewGroupModal = signal(false);

  currentUserProfile = signal<User | null>(null);
  conversations = signal<ConversationListItem[]>([]);

  searchResults = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return [];

    return this.conversations().filter((c) => c.name.toLowerCase().includes(term));
  });

  showSearchDropdown = computed(() => this.searchFocused() && this.searchTerm().trim().length > 0);

  activeConversationId = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => /\/chat\/([^/]+)/.exec(e.urlAfterRedirects)?.[1] ?? null),
    ),
    { initialValue: /\/chat\/([^/]+)/.exec(this.router.url)?.[1] ?? null },
  );

  get pinnedConversations() {
    return this.sortByLatest(this.conversations().filter((c) => c.isPinned)).map((c) =>
      this.readConversationIds().has(c.id) ? { ...c, unreadCount: 0 } : c,
    );
  }

  get allConversations() {
      return this.sortByLatest(this.conversations().filter((c) => !c.isPinned)).map((c) =>
        this.readConversationIds().has(c.id) ? { ...c, unreadCount: 0 } : c,
      );
  }

  private sortByLatest(items: ConversationListItem[]): ConversationListItem[]{
    return [...items].sort((a, b) => {
      const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return timeB - timeA;
    })
  }

  constructor() {
    const userId = this.authService.currentUser()?.userId;
    if (!userId) return;

    this.userService.getById(userId).subscribe((user) => this.currentUserProfile.set(user));
    this.loadConversations(userId);

    this.signalRService.onUserOnlineStatusChanged
      .pipe(takeUntilDestroyed())
      .subscribe(({ userId, isOnline }) => {
        this.conversations.update((list) =>
          list.map((c) => (c.otherUserId === userId ? { ...c, isOnline } : c)),
        );
      });

    this.signalRService.onConversationUpdated
      .pipe(takeUntilDestroyed())
      .subscribe(({ conversationId, lastMessagePreview, lastMessageAt }) => {
        this.conversations.update((list) =>
          list.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessage: lastMessagePreview,
                  lastMessageAt,
                  time: formatConversationTime(lastMessageAt),
                }
              : c,
          ),
        );
      });
  }

  setTab(tab: 'message' | 'group') {
    this.activeTab.set(tab);
  }

  openNewChat() {
    if (this.activeTab() === 'group') {
      this.showNewGroupModal.set(true);
    } else {
      this.showNewConversationModal.set(true);
    }
  }

  logout() {
    this.showLogoutConfirm.set(true);
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

  onGroupCreated() {
    const userId = this.authService.currentUser()?.userId;
    if (userId) this.loadConversations(userId);
  }

  clearSearch() {
    this.searchTerm.set('');
    this.searchFocused.set(false);
  }

  selectSearchResult(item: ConversationListItem) {
    this.router.navigate(['/chat', item.id]);
    this.clearSearch();
  }

  confirmLogout() {
    this.showLogoutConfirm.set(false);
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
