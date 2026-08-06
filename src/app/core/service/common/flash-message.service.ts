import { Injectable, signal } from '@angular/core';

export type ResponseType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastItem {
  id: number;
  type: ResponseType;
  title?: string;
  message: string;
  duration?: number;
  isLoading?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FlashMessageService {
  toasts = signal<ToastItem[]>([]);

  show(
    message: string,
    type: ResponseType = 'info',
    title?: string,
    duration: number = 3000,
  ) {
    const id = Date.now() + Math.random();

    const toast: ToastItem = {
      id,
      type,
      title,
      message,
      duration,
      isLoading: type === 'loading',
    };

    this.toasts.update((items) => [...items, toast]);

    if (type !== 'loading' && duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }

    return id;
  }

  success(message: string, title: string = 'Thành công') {
    return this.show(message, 'success', title);
  }

  error(message: string, title: string = 'Lỗi') {
    return this.show(message, 'error', title, 5000);
  }

  warning(message: string, title: string = 'Cảnh báo') {
    return this.show(message, 'warning', title);
  }

  info(message: string, title: string = 'Thông báo') {
    return this.show(message, 'info', title);
  }

  loading(message: string = 'Đang xử lý...', title: string = 'Vui lòng chờ') {
    return this.show(message, 'loading', title, 0);
  }

  persistent(message: string, type: ResponseType = 'info', title?: string) {
    return this.show(message, type, title, 0);
  }

  update(
    id: number,
    message: string,
    type: ResponseType = 'success',
    title?: string,
    duration: number = 3000,
  ) {
    this.toasts.update((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              message,
              type,
              title,
              duration,
              isLoading: type === 'loading',
            }
          : item,
      ),
    );

    if (type !== 'loading') {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  remove(id: number) {
    this.toasts.update((items) => items.filter((item) => item.id !== id));
  }

  clear() {
    this.toasts.set([]);
  }
}