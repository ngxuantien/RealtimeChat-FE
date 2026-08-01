import { Component, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { SettingsCard } from '../components/settings-card/settings-card';
import { SettingsToggleRow } from '../components/settings-toggle-row/settings-toggle-row';

interface BlockedUser {
    id: string;
    name: string;
    avatarUrl: string;
    blockedAt: string;
}

@Component({
    selector: 'app-settings-privacy',
    imports: [LucideAngularModule, SettingsCard, SettingsToggleRow],
    templateUrl: './privacy.html',
})
export class Privacy {
    showOnlineStatus = signal(true);
    showLastSeen = signal(true);
    readReceipts = signal(true);

    allowMessagesFromAnyone = signal(false);
    publicProfile = signal(true);
    allowGroupInvites = signal(true);

    blockedUsers = signal<BlockedUser[]>([
        { id: '1', name: 'Tài khoản spam #1', avatarUrl: 'https://i.pravatar.cc/150?img=11', blockedAt: '15/06/2026' },
        { id: '2', name: 'Tài khoản spam #2', avatarUrl: 'https://i.pravatar.cc/150?img=12', blockedAt: '02/07/2026' },
    ]);

    unblockUser(id: string) {
        this.blockedUsers.update(list => list.filter(u => u.id !== id));
    }
}
