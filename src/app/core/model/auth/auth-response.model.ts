export interface AuthResponse {
    accessToken: string;
    userId: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
}