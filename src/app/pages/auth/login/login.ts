import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideEyeOff, LucideMessageSquare, LucideEye } from '@lucide/angular';
import { RouterLink } from "@angular/router";
import { UiButton } from "@app/share/component/button/button";

@Component({
  selector: 'app-login',
  imports: [FormsModule, LucideMessageSquare, LucideEyeOff, LucideEye, RouterLink, UiButton],
  templateUrl: './login.html',
})
export class Login {
  isTogglePassword = false;
  email = signal('xuantien@gmail.com');
  password = signal('123456');
  rememberMe = signal(false);
  showPassword = signal(false);

  togglePassword() {
    this.showPassword.update(value => !value);
  }

  login() {
    console.log({
      email: this.email(),
      password: this.password(),
      rememberMe: this.rememberMe(),
    });
  }
}