import { Component, input, model, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'app-ui-input',
    imports: [FormsModule],
    templateUrl: './input.html'
})
export class UiInput{
    label = input('');
    placeholder = input('');
    type = input<'text' | 'email' | 'password' | 'tel'>('text');
    required = input(false);

    value = model('');
    protected readonly showPassword = signal(false);

    get inputType(){
        if(this.type() !== 'password') return this.type();
        return this.showPassword() ? 'text' : 'password';
    }

    togglePassword(){
        this.showPassword.update(value => !value);
    }
}