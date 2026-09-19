import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UiButton } from '@app/share/component/button/button';
import { UiInput } from '@app/share/component/input/input';
import { AuthService } from '@app/core/service/auth.service';
import { FlashMessageService } from '@app/core/service/common/flash-message.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink, UiButton, UiInput],
  templateUrl: './reset-password.html',
})
export class ResetPassword {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private flashMessage = inject(FlashMessageService);

  private token = this.route.snapshot.queryParamMap.get('token') ?? '';

  newPassword = signal('');
  confirmPassword = signal('');
  isLoading = signal(false);
  isSuccess = signal(false);

  submit() {
    if (!this.token) {
      this.flashMessage.error('Liên kết không hợp lệ.');
      return;
    }

    if (this.newPassword().length < 6) {
      this.flashMessage.error('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (this.newPassword() !== this.confirmPassword()) {
      this.flashMessage.error('Mật khẩu nhập lại không khớp.');
      return;
    }

    this.isLoading.set(true);

    this.authService
      .resetPassword({ token: this.token, newPassword: this.newPassword() })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.isSuccess.set(true);
          this.flashMessage.success('Đổi mật khẩu thành công.');
          setTimeout(() => this.router.navigateByUrl('/auth/login'), 3000);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.flashMessage.error(err?.error?.message ?? 'Liên kết đã hết hạn hoặc không hợp lệ.');
        },
      });
  }
}
