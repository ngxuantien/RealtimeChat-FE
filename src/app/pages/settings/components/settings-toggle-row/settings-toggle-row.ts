import { Component, input, model } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ToggleSwitch } from '../toggle-switch/toggle-switch';

@Component({
    selector: 'app-settings-toggle-row',
    imports: [LucideAngularModule, ToggleSwitch],
    templateUrl: './settings-toggle-row.html',
    host: { class: 'flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0' },
})
export class SettingsToggleRow {
    label = input.required<string>();
    description = input('');
    icon = input<string | null>(null);
    checked = model(false);
}
