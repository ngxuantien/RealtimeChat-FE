import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { API_ENDPOINT } from '../constants/api-endpoint.constant';
import { Message, MessageAttachment } from '../model/message/message.model';
import { MessageType } from '../enums/message.enum';

export interface SendMessagePayload {
    conversationId: string;
    senderId: string;
    content: string;
    type?: MessageType;
    replyToMessageId?: string | null;
    attachments?: MessageAttachment[];
}

@Injectable({ providedIn: 'root' })
export class MessageService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    getMessages(conversationId: string, page = 1, pageSize = 50) {
        const url = `${this.baseUrl}/${API_ENDPOINT.MESSAGE.BASE}/conversation/${conversationId}?page=${page}&pageSize=${pageSize}`;

        return this.http.get<Message[]>(url);
    }

    sendMessage(payload: SendMessagePayload) {
        const url = `${this.baseUrl}/${API_ENDPOINT.MESSAGE.BASE}`;

        return this.http.post<Message>(url, {
            conversationId: payload.conversationId,
            senderId: payload.senderId,
            type: payload.type ?? MessageType.Text,
            content: payload.content,
            replyToMessageId: payload.replyToMessageId ?? null,
            attachments: payload.attachments ?? [],
        });
    }

    uploadAttachment(file: File){
        const url = `${this.baseUrl}/${API_ENDPOINT.MESSAGE.BASE}/attachments`;
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<MessageAttachment>(url, formData);
    }

    editMessage(messageId: string, userId: string, content: string) {
        const url = `${this.baseUrl}/${API_ENDPOINT.MESSAGE.BASE}/${messageId}/user/${userId}`;
        return this.http.put<Message>(url, { content });
    }

    deleteMessage(messageId: string, userId: string) {
        const url = `${this.baseUrl}/${API_ENDPOINT.MESSAGE.BASE}/${messageId}/user/${userId}`;
        return this.http.delete(url);
    }

    getAttachments(conversationId: string){
        const url = `${this.baseUrl}/${API_ENDPOINT.MESSAGE.BASE}/conversation/${conversationId}/attackments`;
        return this.http.get<Message[]>(url);
    }
}