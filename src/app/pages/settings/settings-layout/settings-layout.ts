import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

interface SettingsNavItem {
    path: string;
    label: string;
    description: string;
    icon: string;
    danger?: boolean;
}

@Component({
    selector: 'app-settings-layout',
    imports: [RouterLink, RouterLinkActive, RouterOutlet, LucideAngularModule],
    templateUrl: './settings-layout.html',
})
export class SettingsLayout {
    protected readonly navItems: SettingsNavItem[] = [
        { path: 'profile', label: 'Hồ sơ', description: 'Thông tin cá nhân & avatar', icon: 'user' },
        { path: 'notifications', label: 'Thông báo', description: 'Âm thanh, preview, lịch', icon: 'bell' },
        { path: 'appearance', label: 'Giao diện', description: 'Chủ đề, màu sắc, font', icon: 'palette' },
        { path: 'privacy', label: 'Quyền riêng tư', description: 'Trạng thái, đã xem, chặn', icon: 'shield' },
        { path: 'security', label: 'Bảo mật', description: 'Mật khẩu, 2FA, phiên', icon: 'lock' },
        { path: 'danger-zone', label: 'Vùng nguy hiểm', description: 'Xóa tài khoản, dữ liệu', icon: 'triangle-alert', danger: true },
    ];
}
