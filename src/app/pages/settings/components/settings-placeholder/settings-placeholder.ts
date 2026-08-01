import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-settings-placeholder',
    imports: [LucideAngularModule],
    templateUrl: './settings-placeholder.html',
})
export class SettingsPlaceholder {
    private readonly route = inject(ActivatedRoute);
    protected readonly data = this.route.snapshot.data as { title: string; description: string; icon: string };
}
