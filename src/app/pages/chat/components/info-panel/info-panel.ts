import { Component, input, output, signal } from '@angular/core';
import { LucideAngularModule } from "lucide-angular";

@Component({
    selector: 'app-info-panel',
    templateUrl: './info-panel.html',
    imports: [LucideAngularModule],
})
export class InfoPanel {
    name = input('');
    avatarUrl = input<string | null>();
    isOnline = input(false);
    close = output<void>();

    sharedImages = signal([
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200',
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200',
    ]);
}