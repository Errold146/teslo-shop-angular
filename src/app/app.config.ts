import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';

import { routes } from './app.routes';
import { authInterceptor } from '@auth/interceptor/auth.interceptor';
import { loggingInterceptor } from '@shared/interceptor/logging.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(
            withFetch(),
            withInterceptors([
                loggingInterceptor,
                authInterceptor
            ])
        ),
    ]
};
