// // mock-data.ts
// // Dữ liệu giả lập dùng tạm cho layout, sẽ thay bằng API/service thật sau.
// import { MessageItem } from '@app/pages/chat/components/message-list/message-list';

// export interface ConversationItem {
//     id: string;
//     name: string;
//     avatarUrl: string;
//     lastMessage: string;
//     time: string;
//     unreadCount: number;
//     isOnline: boolean;
//     isPinned: boolean;
// }

// export const CONVERSATIONS: ConversationItem[] = [
//     { id: '1', name: 'Linh Nguyễn', avatarUrl: 'https://i.pravatar.cc/150?img=5', lastMessage: 'Bạn đã xem file thiết kế mới...', time: '2 phút', unreadCount: 3, isOnline: true, isPinned: true },
//     { id: '2', name: 'Hùng Trần', avatarUrl: 'https://i.pravatar.cc/150?img=12', lastMessage: 'PR đã merge rồi, bạn check...', time: '15 phút', unreadCount: 1, isOnline: true, isPinned: false },
//     { id: '3', name: 'Thu Phạm', avatarUrl: 'https://i.pravatar.cc/150?img=9', lastMessage: 'Campaign Q3 cần review trước...', time: '1 giờ', unreadCount: 0, isOnline: false, isPinned: false },
//     { id: '4', name: 'Đức Lê', avatarUrl: 'https://i.pravatar.cc/150?img=13', lastMessage: 'API endpoint đã deploy lên stagi...', time: '3 giờ', unreadCount: 0, isOnline: true, isPinned: false },
//     { id: '5', name: 'Hà Vũ', avatarUrl: 'https://i.pravatar.cc/150?img=20', lastMessage: 'Animation library nào bạn đang...', time: 'Hôm qua', unreadCount: 0, isOnline: false, isPinned: false },
//     { id: '6', name: 'Trang Đỗ', avatarUrl: 'https://i.pravatar.cc/150?img=25', lastMessage: 'Dashboard metrics đã cập nhật...', time: '2 ngày', unreadCount: 0, isOnline: true, isPinned: false },
//     { id: '7', name: 'Nam Bùi', avatarUrl: 'https://i.pravatar.cc/150?img=15', lastMessage: 'Bạn có thể review pipeline CI/C...', time: '4 ngày', unreadCount: 0, isOnline: false, isPinned: false },
// ];

// export const MOCK_MESSAGES: Record<string, MessageItem[]> = {
//     '1': [
//         { id: 'm1', content: 'Chào bạn, dạo này thế nào?', time: '09:10', isMine: false },
//         { id: 'm2', content: 'Mình ổn, đang xem lại file thiết kế bạn gửi.', time: '09:11', isMine: true },
//         { id: 'm3', content: 'Bạn đã xem file thiết kế mới chưa?', time: '09:12', isMine: false },
//         { id: 'm4', content: 'Rồi, mình thấy phần header cần chỉnh lại spacing.', time: '09:14', isMine: true },
//     ],
//     '2': [
//         { id: 'm1', content: 'PR đã merge rồi, bạn check lại giúp mình nhé.', time: '08:40', isMine: false },
//         { id: 'm2', content: 'Ok để mình pull về test thử.', time: '08:42', isMine: true },
//     ],
//     '3': [
//         { id: 'm1', content: 'Campaign Q3 cần review trước thứ 6 nhé.', time: 'Hôm qua', isMine: false },
//     ],
// };
