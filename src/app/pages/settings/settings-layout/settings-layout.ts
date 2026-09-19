import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';

interface SettingsNavItem {
  path: string;
  label: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-settings-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, LucideAngularModule],
  templateUrl: './settings-layout.html',
})
export class SettingsLayout {
  private router = inject(Router);

  protected readonly navItems: SettingsNavItem[] = [
    { path: 'profile', label: 'Hồ sơ', description: 'Thông tin cá nhân & avatar', icon: 'user' },
    {
      path: 'appearance',
      label: 'Giao diện',
      description: 'Chủ đề, màu sắc, font',
      icon: 'palette',
    },
  ];

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected readonly isDetailOpen = computed(
    () => /\/settings\/.+/.test(this.currentUrl()) && this.currentUrl() !== '/settings/menu',
  );

  protected readonly asideClass = computed(
    () =>
      `${this.isDetailOpen() ? 'hidden' : 'flex flex-1'} md:flex md:flex-none flex-col shrink-0 overflow-y-auto border-b border-border-300 px-2 py-3 md:w-72 md:overflow-x-visible md:border-r md:border-b-0 md:px-4 md:py-6`,
  );

  protected readonly mainClass = computed(
    () =>
      `${this.isDetailOpen() ? 'flex' : 'hidden'} md:flex flex-1 flex-col overflow-y-auto px-4 py-6 md:px-8 md:py-8`,
  );
}
