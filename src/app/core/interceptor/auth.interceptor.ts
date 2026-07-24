import { HttpInterceptorFn } from '@angular/common/http';
import { STORAGE_KEY } from '@app/core/constants/storage.constant';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);

    if (!token) {
        return next(req);
    }

    return next(req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
    }));
};