import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { SettingsCard } from '../components/settings-card/settings-card';

@Component({
    selector: 'app-settings-profile',
    imports: [FormsModule, LucideAngularModule, SettingsCard],
    templateUrl: './profile.html',
})
export class Profile {
    avatarUrl = signal('https://i.pravatar.cc/150?img=3');
    displayName = signal('Minh Tuấn');
    username = signal('minhtuan.dev');
    email = signal('minhtuan@chatflow.vn');
    phone = signal('+84 901 234 567');
    bio = signal('Building things that matter 🚀');

    saveProfile() {
        // TODO: gọi API cập nhật hồ sơ
    }
}
