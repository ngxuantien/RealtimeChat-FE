export interface User {
    id: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    avatarUrl: string | null;
    bio: string | null;
    isOnline: boolean;
    lastSeenAt: string | null;
}