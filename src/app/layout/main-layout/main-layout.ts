import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Sidebar } from "@app/pages/chat/components/sidebar/sidebar";

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './main-layout.html',
})
export class MainLayout {
  private readonly router = inject(Router);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  // On mobile, only one pane (conversation list or chat detail) is visible at a time.
  protected readonly isConversationOpen = computed(() => /\/chat\//.test(this.currentUrl()));

  protected readonly sidebarClass = computed(
    () =>
      `${this.isConversationOpen() ? 'hidden' : 'flex'} md:flex w-full md:w-80 shrink-0 border-r border-[#D7DBE3] shadow-xl`,
  );

  protected readonly contentClass = computed(
    () => `${this.isConversationOpen() ? 'flex' : 'hidden'} md:flex min-w-0 flex-1 flex-col`,
  );
}
