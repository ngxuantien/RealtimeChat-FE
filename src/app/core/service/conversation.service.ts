import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { API_ENDPOINT } from '../constants/api-endpoint.constant';
import { Conversation } from '../model/conversation/conversation.model';
import { ConversationMember } from '../model/conversation/conversation-member.model';

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  addMember(conversationId: string, userId: string){
    const url = `${this.baseUrl}/${API_ENDPOINT.CONVERSATION.DETAIL}/${conversationId}/members`;
    return this,this.http.post(url, {userId});
  }

  removeMember(conversationId: string, userId: string) {
    const url = `${this.baseUrl}/${API_ENDPOINT.CONVERSATION.DETAIL}/${conversationId}/members/${userId}`;
    return this.http.delete(url);
  }

  leaveConversation(conversationId: string, userId: string) {
    const url = `${this.baseUrl}/${API_ENDPOINT.CONVERSATION.LIST}/${conversationId}/leave/${userId}`;
    return this.http.post(url, {});
  }

  deleteGroup(conversationId: string) {
    const url = `${this.baseUrl}/${API_ENDPOINT.CONVERSATION.LIST}/${conversationId}/group`;
    return this.http.delete(url);
  }

  getUserConversations(userId: string) {
    const url = `${this.baseUrl}/${API_ENDPOINT.CONVERSATION.LIST}/user/${userId}`;
    return this.http.get<Conversation[]>(url);
  }

  getById(conversationId: string) {
    const url = `${this.baseUrl}/${API_ENDPOINT.CONVERSATION.DETAIL}/${conversationId}`;
    return this.http.get<Conversation>(url);
  }

  getMembers(conversationId: string) {
    const url = `${this.baseUrl}/${API_ENDPOINT.CONVERSATION.DETAIL}/${conversationId}/members`;
    return this.http.get<ConversationMember[]>(url);
  }

  getUnreadCount(conversationId: string, userId: string) {
    const url = `${this.baseUrl}/${API_ENDPOINT.CONVERSATION.DETAIL}/${conversationId}/members/${userId}/unread-count`;
    return this.http.get<{ unreadCount: number }>(url);
  }

  createPrivateConversation(currentUserId: string, targetUserId: string) {
    return this.http.post<Conversation>(
      `${this.baseUrl}/${API_ENDPOINT.CONVERSATION.LIST}/private`,
      {
        currentUserId,
        targetUserId,
      },
    );
  }

  markAsRead(conversationId: string, userId: string, messageId: string) {
    const url = `${this.baseUrl}/${API_ENDPOINT.CONVERSATION.DETAIL}/${conversationId}/members/${userId}/read`;
    return this.http.patch(url, { messageId });
  }

  createGroupConversation(payload: { createdByUserId: string; name: string; memberIds: string[] }) {
    return this.http.post<Conversation>(
      `${this.baseUrl}/${API_ENDPOINT.CONVERSATION.LIST}/group`,
      payload,
    );
  }

  updateMute(conversationId: string, isMuted: boolean){
    const url = `${this.baseUrl}/${API_ENDPOINT.CONVERSATION.DETAIL}/${conversationId}/members/mute`;
    return this.http.patch(url, { isMuted });
  }

  deleteConversation(conversationId: string, userId: string) {
    const url = `${this.baseUrl}/${API_ENDPOINT.CONVERSATION.LIST}/${conversationId}/user/${userId}`;
    return this.http.delete(url);
  }
}
