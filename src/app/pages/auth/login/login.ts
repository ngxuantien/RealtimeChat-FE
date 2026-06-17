import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideEye, LucideMessageSquare } from '@lucide/angular';

@Component({
  selector: 'app-login',
  imports: [FormsModule, LucideEye, LucideMessageSquare],
  templateUrl: './login.html',
})
export class Login {
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