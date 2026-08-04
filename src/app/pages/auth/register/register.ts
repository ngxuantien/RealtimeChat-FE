import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideCamera, LucideMessageSquare } from '@lucide/angular';
import { UiInput } from '../../../share/component/input/input';
import { UiButton } from '../../../share/component/button/button';
import { AuthService } from '@app/core/service/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, UiButton, UiInput, LucideCamera, LucideMessageSquare],
  templateUrl: './register.html',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  userName = signal('');
  email = signal('');
  phoneNumber = signal('');
  password = signal('');
  confirmPassword = signal('');
  avatarPreview = signal<string | null>(null);
  avatarFile: File | null = null;

  isLoading = signal(false);
  errorMessage = signal('');

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.avatarFile = file;
    const reader = new FileReader();
    reader.onload = () => this.avatarPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  register() {
    this.errorMessage.set('');

    if (this.password() !== this.confirmPassword()) {
      this.errorMessage.set('Mật khẩu xác nhận không khớp.');
      return;
    }

    this.isLoading.set(true);

    this.authService
      .register({
        displayName: this.userName(),
        email: this.email(),
        phoneNumber: this.phoneNumber(),
        password: this.password(),
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigateByUrl('/');
        },
        error: () => {
          this.isLoading.set(false);
          this.errorMessage.set('Không thể đăng ký. Email hoặc số điện thoại đã được sử dụng.');
        },
      });
  }
}
