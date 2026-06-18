import { Component, signal } from "@angular/core";
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideCamera, LucideMessageSquare } from '@lucide/angular';
import { UiInput } from "../../../share/component/input/input";
import { UiButton } from "../../../share/component/button/button";

@Component({
  selector: 'app-register',
  imports: [ FormsModule, RouterLink, UiButton, UiInput, LucideCamera, LucideMessageSquare ],
  templateUrl: './register.html',
})
export class Register {
  userName = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');

  register() {
    console.log({
      fullName: this.userName(),
      email: this.email(),
      password: this.password(),
      confirmPassword: this.confirmPassword(),
    });
  }
}