import { Injectable, effect, signal } from '@angular/core';
import { STORAGE_KEY } from '@app/core/constants/storage.constant';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    theme = signal<Theme>(this.readStoredTheme());

    constructor() {
        effect(() => {
            const theme = this.theme();
            document.documentElement.classList.toggle('dark', theme === 'dark');
            localStorage.setItem(STORAGE_KEY.THEME, theme);
        });
    }

    toggle() {
        this.theme.update(t => (t === 'dark' ? 'light' : 'dark'));
    }

    setTheme(theme: Theme) {
        this.theme.set(theme);
    }

    private readStoredTheme(): Theme {
        return localStorage.getItem(STORAGE_KEY.THEME) === 'dark' ? 'dark' : 'light';
    }
}
