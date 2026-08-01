import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { SettingsCard } from '../components/settings-card/settings-card';
import { Theme, ThemeService } from '@app/core/service/theme.service';

@Component({
    selector: 'app-settings-appearance',
    imports: [LucideAngularModule, SettingsCard],
    templateUrl: './appearance.html',
})
export class Appearance {
    protected readonly themeService = inject(ThemeService);

    select(theme: Theme) {
        this.themeService.setTheme(theme);
    }
}
