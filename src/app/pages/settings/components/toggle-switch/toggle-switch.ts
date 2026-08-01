import { Component, model } from '@angular/core';

@Component({
    selector: 'app-toggle-switch',
    templateUrl: './toggle-switch.html',
    host: { class: 'inline-block' },
})
export class ToggleSwitch {
    checked = model(false);

    toggle() {
        this.checked.update(v => !v);
    }
}
