import { Routes } from '@angular/router';
import { NotAuthGuard } from '@auth/guards/not-auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes'),
        canMatch: [
            NotAuthGuard
        ]
    },
    {
        path: '',
        loadChildren: () => import('./store/store-front.routes'),
    }
];
