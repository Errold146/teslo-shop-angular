import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '@auth/services/auth.service';

@Component({
    selector: 'admin-layout',
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {

    authService = inject(AuthService)

    user = computed(() => this.authService.user())
}
