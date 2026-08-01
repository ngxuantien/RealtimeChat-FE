import { Component, signal } from '@angular/core';
import { SettingsCard } from '../components/settings-card/settings-card';
import { SettingsToggleRow } from '../components/settings-toggle-row/settings-toggle-row';

@Component({
    selector: 'app-settings-notifications',
    imports: [SettingsCard, SettingsToggleRow],
    templateUrl: './notifications.html',
})
export class Notifications {
    directMessages = signal(true);
    groupMessages = signal(true);
    mentions = signal(true);

    notificationSound = signal(true);
    desktopNotifications = signal(true);
    messagePreview = signal(true);

    doNotDisturb = signal(false);
}
