import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideMessageSquare } from '@lucide/angular';
import { Router, RouterLink } from "@angular/router";
import { UiButton } from "@app/share/component/button/button";
import { UiInput } from "@app/share/component/input/input";
import { AuthService } from '@app/core/service/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, LucideMessageSquare, RouterLink, UiButton, UiInput],
  templateUrl: './login.html',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  rememberMe = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  login() {
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.authService.login({ email: this.email(), password: this.password() }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Email hoặc mật khẩu không đúng.');
      },
    });
  }
}
