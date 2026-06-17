import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login',
  imports: [FormsModule, LucideAngularModule],
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