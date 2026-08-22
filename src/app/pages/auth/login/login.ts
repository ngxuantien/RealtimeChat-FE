import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideMessageSquare } from '@lucide/angular';
import { Router, RouterLink } from "@angular/router";
import { UiButton } from "@app/share/component/button/button";
import { UiInput } from "@app/share/component/input/input";
import { AuthService } from '@app/core/service/auth.service';
import { FlashMessageService } from '@app/core/service/common/flash-message.service';
import { SignalRService } from '@app/core/service/common/signalr.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, LucideMessageSquare, RouterLink, UiButton, UiInput],
  templateUrl: './login.html',
})
export class Login {
  private authService = inject(AuthService);
  private readonly flashMessageService = inject(FlashMessageService);
  private readonly signalRService = inject(SignalRService);
  private router = inject(Router);

  phoneNumber = signal('');
  password = signal('');
  rememberMe = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  login() {
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.authService.login({phoneNumber: this.phoneNumber(), password: this.password() }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.signalRService.connect();
        this.router.navigateByUrl('/');
        this.flashMessageService.show('Đăng nhập thành công', 'success');
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Số điện thoại hoặc mật khẩu không đúng.');
      },
    });
  }
}
