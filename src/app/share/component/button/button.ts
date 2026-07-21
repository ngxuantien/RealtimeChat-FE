// button.ts
import { Component, computed, input } from "@angular/core";

@Component({
    selector: 'app-ui-button',
    templateUrl: './button.html',
    host: {
        class: 'block'
    }
})
export class UiButton {
    type = input<'button' | 'submit'>('button');
    variant = input<'primary' | 'outline' | 'ghost' | 'danger'>('primary');
    size = input<'sm' | 'md' | 'lg'>('md');
    disabled = input(false);
    loading = input(false);
    full = input(false);

    protected readonly classes = computed(() => {
        const base = 'inline-flex items-center justify-center gap-2 cursor-pointer rounded-md font-medium transition outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50';

        const sizeMap: Record<string, string> = {
            sm: 'h-8 px-3 text-xs',
            md: 'h-10 px-4 text-sm',
            lg: 'h-12 px-6 text-base',
        };

        const variantMap: Record<string, string> = {
            primary: 'bg-primary text-white hover:bg-[#0E67C7]',
        };

        return [
            base,
            sizeMap[this.size()],
            variantMap[this.variant()],
            this.full() ? 'w-full' : '',
        ].join(' ');
    });
}