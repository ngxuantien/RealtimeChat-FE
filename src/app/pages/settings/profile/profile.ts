import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { SettingsCard } from '../components/settings-card/settings-card';
import { AuthService } from '@app/core/service/auth.service';
import { UserService } from '@app/core/service/user.service';
import { FlashMessageService } from '@app/core/service/common/flash-message.service';

@Component({
  selector: 'app-settings-profile',
  imports: [FormsModule, LucideAngularModule, SettingsCard],
  templateUrl: './profile.html',
})
export class Profile {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private flashMessage = inject(FlashMessageService);

  private avatarInput = viewChild<ElementRef<HTMLInputElement>>('avatarInput');

  avatarUrl = signal<string | null>(null);
  displayName = signal('');
  email = signal('');
  phone = signal('');

  isLoading = signal(true);
  isSaving = signal(false);
  isUploadingAvatar = signal(false);

  constructor(){
    const userId = this.authService.currentUser()?.userId;
    if(!userId) return;

    this.userService.getById(userId).subscribe({
        next: (user) => {
            this.avatarUrl.set(user.avatarUrl);
            this.displayName.set(user.displayName);
            this.email.set(user.email);
            this.phone.set(user.phoneNumber);
            this.isLoading.set(false);
        },
        error: () => {
            this.isLoading.set(false);
        },
    });
  }

  pickAvatar() {
    this.avatarInput()?.nativeElement.click();
  }

  onAvatarSelected(event: Event){
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if(!file) return;

    const userId = this.authService.currentUser()?.userId;
    if(!userId) return;

    this.isUploadingAvatar.set(true);
    this.userService.updateAvatar(userId, file).subscribe({
        next: (user) => {
            this.avatarUrl.set(user.avatarUrl);
            this.isUploadingAvatar.set(false);
            this.flashMessage.success("Cập nhật ảnh đại diện thành công");
        },
        error: () => {
            this.isUploadingAvatar.set(false);
            this.flashMessage.error("Cập nhật ảnh đại diện thất bại");
        },
    })
  }

  saveProfile(){
    const userId = this.authService.currentUser()?.userId;
    if(!userId) return;

    this.isSaving.set(true);
    this.userService.updateUser(userId, {
        displayName: this.displayName().trim(),
        email: this.email().trim(),
        phoneNumber: this.phone().trim(),
    })
    .subscribe({
        next: () => {
            this.isSaving.set(false);
            this.flashMessage.success("Cập nhật hồ sơ thành công");
        },
        error: (err) => {
            this.isSaving.set(false);
            this.flashMessage.error(err?.error?.message ?? "Cập nhật hồ sơ thất bại");
        },
    });
  }
}
