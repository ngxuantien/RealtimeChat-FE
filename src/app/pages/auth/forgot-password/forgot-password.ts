import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UiButton } from '@app/share/component/button/button';
import { UiInput } from '@app/share/component/input/input';
import { AuthService } from '@app/core/service/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink, UiButton, UiInput],
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  private authService = inject(AuthService);

  email = signal('');
  isLoading = signal(false);
  isSent = signal(false);
  errorMessage = signal('');

  submit() {
    if (!this.email().trim()) return;

    this.errorMessage.set('');
    this.isLoading.set(true);

    this.authService.forgotPassword({ email: this.email().trim() }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSent.set(true);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Không thể gửi yêu cầu, thử lại sau.');
      },
    });
  }
}
