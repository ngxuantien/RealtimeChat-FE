import { Component, inject, input, output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

export interface ConfirmConfig {
  title: string;
  message: string;
  confirmLabel: string;
  closeLabel: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.html'
})
export class ConfirmModal{
  private sanitizer = inject(DomSanitizer);

  title = input<string>('');
  message = input<string>('');
  confirmLabel = input<string>('Xác Nhận');
  closeLabel = input<string>('Hủy');

  confirmed = output<void>();
  closed = output<void>();

  get safeMessage() {
    return this.sanitizer.bypassSecurityTrustHtml(this.message());
  }

  onConfirm() { this.confirmed.emit(); }
  onCancel() { this.closed.emit(); }
}