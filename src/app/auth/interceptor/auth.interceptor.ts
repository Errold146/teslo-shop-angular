import { inject } from "@angular/core";
import { HttpHandlerFn, HttpRequest } from "@angular/common/http";

import { AuthService } from "@auth/services/auth.service";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {

    const token = inject(AuthService).token();

    const newReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(newReq);
}
