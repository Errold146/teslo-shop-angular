import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

import { AuthService } from '@auth/services/auth.service';

export const NotAuthGuard: CanMatchFn = () => {
    const authService = inject(AuthService)
    const router = inject(Router)

    const token = localStorage.getItem('token')
    if (token) {
        router.navigateByUrl('/')
        return false
    }

    return true
}

