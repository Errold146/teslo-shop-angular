# 🛍️ TesloShop

TesloShop is a modern e-commerce frontend built with Angular 20, designed to showcase clean architecture, responsive UI, and scalable component design. It integrates authentication, routing, and modular features to simulate a real-world shopping experience.

## 🚀 Technologies Used

- [Angular CLI v20.2.1](https://github.com/angular/angular-cli)
- [RxJS](https://rxjs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- Angular Signals & Standalone Components
- RESTful API integration

## 📦 Installation

Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/teslo-shop.git
cd teslo-shop
npm install
```

## 🧪 Development Server
Start the local server:
```bash
ng serve -o
```
Navigate to http://localhost:4200/. The app will auto-reload on file changes.

## 🛠️ Code Scaffolding
Generate components, directives, services, etc. using Angular CLI:
```bash
ng generate component component-name
ng generate service auth/auth

```

For more options:
```bash
ng generate --help

```

## 🏗️ Build
Compile the project for production:
```bash
ng build
```
Build artifacts will be stored in the dist/ folder.

## ✅ Testing
Unit Tests
Run unit tests with Karma:
```bash
ng test
```

## End-to-End Tests
Run e2e tests (setup required):
```bash
ng e2e
```
Note: Angular CLI no longer includes Protractor by default. You can integrate Cypress or Playwright.

## 🔐 Authentication
TesloShop includes a basic auth flow with token-based login and registration. Tokens are stored in localStorage and validated via an /auth/check-status endpoint.

## 📁 Project Structure

```bash
src/
├── app/
│   ├── admin/         # Panel administrativo, gestión de usuarios/productos
│   ├── auth/          # Login, registro, validación de token
│   ├── products/      # Catálogo, detalles, filtros y lógica de productos
│   ├── shared/        # Componentes reutilizables, directivas, pipes
│   ├── store/         # Estado global, signals, servicios de sincronización
│   ├── utils/         # Funciones auxiliares, helpers, validaciones
├── environments/      # Configuración para desarrollo y producción
└── index.html         # Entrada principal de la aplicación

```

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

## 📚 Resources

- [Angular Documentation](https://angular.dev/)
- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
- [RxJS Guide](https://rxjs.dev/guide/overview)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [DaisyUI Components](https://daisyui.com/components/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Karma Test Runner](https://karma-runner.github.io/latest/index.html)
- [Cypress Testing Framework](https://www.cypress.io/)

## 📄 License
This project is licensed under the MIT License.
