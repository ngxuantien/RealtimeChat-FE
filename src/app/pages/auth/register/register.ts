import { Component, signal } from "@angular/core";
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideCamera, LucideMessageSquare } from '@lucide/angular';
import { UiInput } from "../../../share/component/input/input";
import { UiButton } from "../../../share/component/button/button";

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, UiButton, UiInput, LucideCamera, LucideMessageSquare],
  templateUrl: './register.html',
})
export class Register {
  userName = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  avatarPreview = signal<string | null>(null);
  avatarFile: File | null = null;

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
    console.log({
      fullName: this.userName(),
      email: this.email(),
      password: this.password(),
      confirmPassword: this.confirmPassword(),
    });
  }
}