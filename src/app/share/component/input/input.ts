import { Component, input, model, signal, computed } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LucideEye, LucideEyeOff } from "@lucide/angular";

let uidCounter = 0;

@Component({
    selector: 'app-ui-input',
    imports: [FormsModule, LucideEye, LucideEyeOff],
    templateUrl: './input.html',
    host: {
        class: 'block'
    }
})
export class UiInput {
    label = input('');
    placeholder = input('');
    type = input<'text' | 'email' | 'password' | 'tel'>('text');
    required = input(false);
    disabled = input(false);
    error = input('');

    value = model('');
    protected readonly showPassword = signal(false);
    protected readonly inputId = `ui-input-${uidCounter++}`;

    get inputType() {
        if (this.type() !== 'password') return this.type();
        return this.showPassword() ? 'text' : 'password';
    }

    togglePassword() {
        this.showPassword.update(v => !v);
    }
}