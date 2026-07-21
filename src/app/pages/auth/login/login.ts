import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideMessageSquare } from '@lucide/angular';
import { RouterLink } from "@angular/router";
import { UiButton } from "@app/share/component/button/button";
import { UiInput } from "@app/share/component/input/input";

@Component({
  selector: 'app-login',
  imports: [FormsModule, LucideMessageSquare, RouterLink, UiButton, UiInput],
  templateUrl: './login.html',
})
export class Login {
  email = signal('');
  password = signal('');
  rememberMe = signal(false);
  isLoading = signal(false);
}