// src/app/services/notification.service.ts
import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  timeout?: number; // Add optional timeout property
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications = signal<Notification[]>([]);

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  show(type: Notification['type'], title: string, message: string, timeout = 5000) {
    const notification: Notification = {
      id: this.generateId(),
      type,
      title,
      message,
      timestamp: new Date(),
      timeout // Include timeout in notification object
    };

    this.notifications.update(notifications => [...notifications, notification]);
  }

  remove(id: string) {
    this.notifications.update(notifications =>
      notifications.filter(n => n.id !== id)
    );
  }

  success(title: string, message: string, timeout?: number) {
    this.show('success', title, message, timeout);
  }

  error(title: string, message: string, timeout?: number) {
    this.show('error', title, message, timeout);
  }

  warning(title: string, message: string, timeout?: number) {
    this.show('warning', title, message, timeout);
  }

  info(title: string, message: string, timeout?: number) {
    this.show('info', title, message, timeout);
  }
}
