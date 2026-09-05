import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, debounceTime, distinctUntilChanged, filter, switchMap, of, catchError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@app/core/service/auth.service';
import { UserService } from '@app/core/service/user.service';
import { ConversationService } from '@app/core/service/conversation.service';
import { User } from '@app/core/model/user/user.model';
import { isValidPhoneNumber, sanitizePhoneInput } from '@app/core/utils/phone.util';

@Component({
    selector: 'app-new-conversation-modal',
    imports: [FormsModule, LucideAngularModule],
    templateUrl: './new-conversation-modal.html',
})
export class NewConversationModal {
    private authService = inject(AuthService);
    private userService = inject(UserService);
    private conversationService = inject(ConversationService);
    private router = inject(Router);

    close = output<void>();
    created = output<void>();

    phoneNumber = signal('');
    isSearching = signal(false);
    isCreating = signal(false);
    errorMessage = signal('');
    foundUser = signal<User | null>(null);

    private search$ = new Subject<string>();

    constructor() {
        this.search$
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                filter((phone) => isValidPhoneNumber(phone)),
                switchMap((phone) => {
                    this.isSearching.set(true);

                    return this.userService.getByPhone(phone).pipe(
                        catchError(() => {
                            this.errorMessage.set('Không tìm thấy người dùng với số điện thoại này.');
                            return of(null);
                        }),
                    );
                }),
                takeUntilDestroyed(),
            )
            .subscribe((user) => {
                this.isSearching.set(false);
                if (user) this.foundUser.set(user);
            });
    }

    onPhoneChange(value: string) {
        const sanitized = sanitizePhoneInput(value);
        this.phoneNumber.set(sanitized);
        this.foundUser.set(null);
        this.errorMessage.set('');

        if (sanitized.length === 0) return;
        this.search$.next(sanitized);
    }

    startConversation() {
        const currentUserId = this.authService.currentUser()?.userId;
        const target = this.foundUser();
        if (!currentUserId || !target) return;

        this.isCreating.set(true);

        this.conversationService.createPrivateConversation(currentUserId, target.id).subscribe({
            next: (conversation) => {
                this.isCreating.set(false);
                this.created.emit();
                this.close.emit();
                this.router.navigate(['/chat', conversation.id]);
            },
            error: () => {
                this.isCreating.set(false);
                this.errorMessage.set('Không thể tạo cuộc trò chuyện, thử lại sau.');
            },
        });
    }
}