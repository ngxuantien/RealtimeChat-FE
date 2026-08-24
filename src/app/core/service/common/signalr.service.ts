import { Injectable } from '@angular/core';
import { STORAGE_KEY } from '@app/core/constants/storage.constant';
import { Message } from '@app/core/model/message/message.model';
import * as signalR from '@microsoft/signalr';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection: signalR.HubConnection | null = null;

  private messageReceived$ = new Subject<Message>();
  private messageEdited$ = new Subject<Message>();

  private userOnlineStatusChanged$ = new Subject<{
    userId: string;
    isOnline: boolean;
    lastSeenAt: string | null;
  }>();
  onUserOnlineStatusChanged = this.userOnlineStatusChanged$.asObservable();

  private conversationUpdated$ = new Subject<{
    conversationId: string;
    lastMessagePreview: string;
    lastMessageAt: string;
  }>();
  onConversationUpdated = this.conversationUpdated$.asObservable();

  onMessageReceived = this.messageReceived$.asObservable();
  onMessageEdited = this.messageEdited$.asObservable();

  connect() {
    if (this.hubConnection) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.hubUrl, {
        accessTokenFactory: () => localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN) ?? '',
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('UserOnlineStatusChanged', (payload) =>
      this.userOnlineStatusChanged$.next(payload),
    );

    this.hubConnection.on('ReceiveMessage', (message: Message) =>
      this.messageReceived$.next(message),
    );

    this.hubConnection.on('ConversationUpdated', (payload) => this.conversationUpdated$.next(payload));
    
    this.hubConnection.on('MessageEdited', (message: Message) => this.messageEdited$.next(message));

    this.hubConnection.start().catch((err) => console.error('Lỗi kết nối SignalR:', err));
  }

  joinConversation(conversationId: string) {
    this.hubConnection
      ?.invoke('JoinConversation', conversationId)
      .catch((err) => console.error(err));
  }

  leaveConversation(conversationId: string) {
    this.hubConnection
      ?.invoke('LeaveConversation', conversationId)
      .catch((err) => console.error(err));
  }
}
