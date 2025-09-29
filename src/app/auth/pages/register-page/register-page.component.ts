import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Component, inject, signal } from '@angular/core';

import { AuthService } from '@auth/services/auth.service';

@Component({
    selector: 'register-page',
    imports: [RouterLink, ReactiveFormsModule],
    templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {

    fb = inject(FormBuilder)
    authService = inject(AuthService)
    router = inject(Router)

    hasError = signal(false)

    registerForm = this.fb.group({
        fullName: ['', Validators.required],
        email: ['', [
            Validators.required,
            Validators.email
        ]],
        password: ['',[
            Validators.required,
            Validators.minLength(6)
        ]]
    })

    onSubmit() {
        if (this.registerForm.invalid) {
            this.hasError.set(true)
            setTimeout(() => this.hasError.set(false), 3000)
            return
        }

        const { fullName = '', email = '', password = '' } = this.registerForm.value

        this.authService.register(fullName!, email!, password!).subscribe(isAuth => {
            if (isAuth) {
                this.router.navigateByUrl('/')
                return
            }

            this.hasError.set(true)
            setTimeout(() => this.hasError.set(false), 3000)
        })
    }

}
