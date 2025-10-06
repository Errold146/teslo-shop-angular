import { firstValueFrom } from 'rxjs';
import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

import { AuthService } from '@auth/services/auth.service';

export const NotAuthGuard: CanMatchFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    await firstValueFrom(authService.checkStatus());

    if (authService.authStatus() === 'authenticated') {
        router.navigateByUrl('/');
        return false;
    }

    return true;
}



