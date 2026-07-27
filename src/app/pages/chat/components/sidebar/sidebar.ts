import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

interface ConversationItem {
    id: string;
    name: string;
    avatarUrl: string;
    lastMessage: string;
    time: string;
    unreadCount: number;
    isOnline: boolean;
    isPinned: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  imports: [LucideAngularModule, FormsModule],
})
export class Sidebar {
    activeTab = signal<'message' | 'group'>('message');
    searchTerm = signal('');

    conversations = signal<ConversationItem[]>([
        { id: '1', name: 'Linh Nguyễn', avatarUrl: 'https://i.pravatar.cc/150?img=5', lastMessage: 'Bạn đã xem file thiết kế mới...', time: '2 phút', unreadCount: 3, isOnline: true, isPinned: true },
        { id: '2', name: 'Hùng Trần', avatarUrl: 'https://i.pravatar.cc/150?img=12', lastMessage: 'PR đã merge rồi, bạn check...', time: '15 phút', unreadCount: 1, isOnline: true, isPinned: false },
        { id: '3', name: 'Thu Phạm', avatarUrl: 'https://i.pravatar.cc/150?img=9', lastMessage: 'Campaign Q3 cần review trước...', time: '1 giờ', unreadCount: 0, isOnline: false, isPinned: false },
        { id: '4', name: 'Đức Lê', avatarUrl: 'https://i.pravatar.cc/150?img=13', lastMessage: 'API endpoint đã deploy lên stagi...', time: '3 giờ', unreadCount: 0, isOnline: true, isPinned: false },
        { id: '5', name: 'Hà Vũ', avatarUrl: 'https://i.pravatar.cc/150?img=20', lastMessage: 'Animation library nào bạn đang...', time: 'Hôm qua', unreadCount: 0, isOnline: false, isPinned: false },
        { id: '6', name: 'Trang Đỗ', avatarUrl: 'https://i.pravatar.cc/150?img=25', lastMessage: 'Dashboard metrics đã cập nhật...', time: '2 ngày', unreadCount: 0, isOnline: true, isPinned: false },
        { id: '7', name: 'Nam Bùi', avatarUrl: 'https://i.pravatar.cc/150?img=15', lastMessage: 'Bạn có thể review pipeline CI/C...', time: '4 ngày', unreadCount: 0, isOnline: false, isPinned: false },
    ]);

    get pinnedConversations() {
        return this.conversations().filter(c => c.isPinned);
    }

    get allConversations() {
        return this.conversations().filter(c => !c.isPinned);
    }

    setTab(tab: 'message' | 'group') {
        this.activeTab.set(tab);
    }
}