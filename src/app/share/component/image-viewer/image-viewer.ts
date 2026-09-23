import { Component, HostListener, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './image-viewer.html',
})
export class ImageViewer {
  imageUrl = input.required<string>();
  closed = output<void>();

  @HostListener('window:keydown.escape')
  onEscape() {
    this.closed.emit();
  }
}