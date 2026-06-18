import { Component, input, model, signal } from "@angular/core";
import { UI_CLASS } from "../../constants/ui-class";
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

    protected readonly ui = UI_CLASS;
    protected readonly showPassword = signal(false);

    get inputType(){
        if(this.type() !== 'password') return this.type();
        return this.showPassword() ? 'text' : 'password';
    }

    togglePassword(){
        this.showPassword.update(value => !value);
    }
}