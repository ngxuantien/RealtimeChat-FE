import { Component, input } from '@angular/core';

@Component({
    selector: 'app-settings-card',
    templateUrl: './settings-card.html',
    host: { class: 'block' },
})
export class SettingsCard {
    title = input('');
    description = input('');
}
