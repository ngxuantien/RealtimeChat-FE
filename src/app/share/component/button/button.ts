import { Component, input } from "@angular/core";

@Component({
    selector: 'app-ui-button',
    templateUrl: './button.html'
})
export class UiButton{
    type = input<'button' | 'submit'>();
    disable = input(false);
}