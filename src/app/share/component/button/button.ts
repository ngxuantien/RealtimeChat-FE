import { Component, input } from "@angular/core";
import { UI_CLASS } from "../../constants/ui-class";

@Component({
    selector: 'app-ui-button',
    templateUrl: './button.html'
})
export class UiButton{
    type = input<'button' | 'submit'>();
    disable = input(false);

    protected readonly ui = UI_CLASS;
}