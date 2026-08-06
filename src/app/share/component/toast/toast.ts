import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FlashMessageService, ToastItem } from '@app/core/service/common/flash-message.service';

@Component({
  selector: 'app-toast',
  imports: [NgClass, LucideAngularModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  toastService = inject(FlashMessageService);

  getIcon(toast: ToastItem) {
    switch (toast.type) {
      case 'success':
        return 'check';
      case 'error':
        return 'x';
      case 'warning':
        return 'triangle-alert';
      case 'info':
        return 'info';
      case 'loading':
        return 'loader-circle';
    }

    return 'info';
  }

  remove(id: number) {
    this.toastService.remove(id);
  }
}
