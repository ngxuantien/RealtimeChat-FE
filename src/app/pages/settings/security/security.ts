import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ToggleSwitch } from '../components/toggle-switch/toggle-switch';

interface SessionItem {
    id: string;
    device: string;
    icon: string;
    location: string;
    lastActive: string;
    current: boolean;
}

@Component({
    selector: 'app-settings-security',
    imports: [FormsModule, LucideAngularModule, ToggleSwitch],
    templateUrl: './security.html',
})
export class Security {
    currentPassword = signal('');
    newPassword = signal('');
    confirmPassword = signal('');
    showCurrentPassword = signal(false);
    showNewPassword = signal(false);
    showConfirmPassword = signal(false);

    twoFactorEnabled = signal(false);

    sessions = signal<SessionItem[]>([
        { id: '1', device: 'Chrome trên Windows', icon: 'monitor', location: 'Hà Nội, Việt Nam', lastActive: 'Đang hoạt động', current: true },
        { id: '2', device: 'Safari trên iPhone 15', icon: 'smartphone', location: 'Hà Nội, Việt Nam', lastActive: '2 giờ trước', current: false },
        { id: '3', device: 'Chrome trên MacBook Air', icon: 'laptop', location: 'Đà Nẵng, Việt Nam', lastActive: '1 ngày trước', current: false },
    ]);

    updatePassword() {
        // TODO: gọi API đổi mật khẩu
    }

    logoutSession(id: string) {
        this.sessions.update(list => list.filter(s => s.id !== id));
    }

    logoutAll() {
        this.sessions.update(list => list.filter(s => s.current));
    }
}
