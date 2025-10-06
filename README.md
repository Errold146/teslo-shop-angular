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

## 🔐 Authentication Flow

TesloShop implementa autenticación basada en tokens JWT, con validación automática del estado de sesión y protección de rutas.

### 🔄 Flujo de inicio de sesión

1. El usuario inicia sesión desde `/auth/login`.
2. El backend responde con un `token` y los datos del usuario.
3. El token se guarda en `localStorage`.
4. El `AuthService` expone el usuario mediante `computed()` y actualiza el estado de autenticación.

### 🛡️ Interceptor de autenticación

Todas las peticiones HTTP incluyen automáticamente el token en el header `Authorization` gracias al interceptor:

```ts
headers: req.headers.set('Authorization', `Bearer ${token}`)
```

## ⚠️ Es importante usar .set() en lugar de .append() para evitar múltiples valores en el header.

## ✅ Validación de sesión:

Al navegar por la aplicación, se ejecuta checkStatus() para validar el token con el backend:

```bash
GET /auth/check-status
Authorization: Bearer <token>
```

Si el token es válido, se actualiza el usuario. Si no, se marca como not-authenticated.

## 🧠 Comportamiento en layouts:

El nombre del usuario se muestra en el layout administrativo (/admin) usando:

```bash
{{ user()?.fullName }}
```

Este valor depende de que checkStatus() sea exitoso y que el token esté correctamente enviado.

## 🧩 Consideraciones:

Si el token es inválido o el backend responde con 401, el usuario se marca como no autenticado.
El token no se elimina automáticamente, a menos que se llame explícitamente a logout().

## ⚙️ Integración reactiva con `rxResource`, `Signal` y `ActivatedRoute`

Este patrón permite cargar productos de forma reactiva combinando parámetros de ruta (`queryParams`) y un `Signal` (`productsPerPage`) en Angular 16+ en este caso Angular 20.

### 🧠 Contexto

Angular lanza el error `NG0203` si se usa `toObservable()` fuera del contexto de inyección. Para evitarlo, convertimos el `Signal` en `Observable` dentro de una propiedad de clase.

### ✅ Implementación

```ts
// ✅ products-admin.component.ts
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rxResource, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, combineLatest } from 'rxjs';

import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
    selector: 'products-admin',
    templateUrl: './products-admin.component.html',
})
export class ProductsAdminComponent {
    private productsService = inject(ProductsService);
    private route = inject(ActivatedRoute);
    pagination = inject(PaginationService);

    productsPerPage = signal(10);
    productsPerPage$ = toObservable(this.productsPerPage); // ✅ dentro del contexto de inyección

    productsResource = rxResource({
        stream: () => combineLatest([
            this.route.queryParams,
            this.productsPerPage$
        ]).pipe(
            switchMap(([params, limit]) => {
                const page = +params['page'] || 1;
                this.pagination.currentPage.set(page);
                const offset = this.pagination.offset();
                return this.productsService.getProducts({ limit, offset });
            })
        )
    });
}
```

## 📝 Manejo de formularios reactivos en Angular con validaciones personalizadas

Este módulo implementa un formulario de **detalles de producto** usando `ReactiveFormsModule`, validaciones con `Validators` y un flujo de guardado controlado desde el método `onSubmit`.

### ⚙️ Definición del FormGroup

```ts
productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [
        Validators.required,
        Validators.pattern(FormUtils.slugPattern)
    ]],
    price: [0, [
        Validators.required,
        Validators.min(0)
    ]],
    stock: [0, [
        Validators.required,
        Validators.min(0)
    ]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: ['men', [
        Validators.required,
        Validators.pattern(/^(men|women|unisex|kid)$/) 
});
```

- Se usa Validators.pattern para restringir el campo gender a valores válidos (men, women, unisex, kid).

- tags se maneja como string en el formulario, pero se transforma en array antes de enviar.

## 📤 Envío del formulario

```ts
onSubmit() {
    console.log('submit');

    this.productForm.markAllAsTouched();

    if (!this.productForm.valid) {
        console.warn('Formulario inválido:', this.productForm.errors);
        return;
    }

    const formValue = this.productForm.value;
    const productLike: Partial<Product> = {
        ...(formValue as any),
        tags: typeof formValue.tags === 'string'
            ? formValue.tags.toLowerCase().split(',').map(tag => tag.trim())
            : []
    };

    console.log({ productLike });
}
```
- Se marca todo el formulario como touched para mostrar errores.

- Si el formulario es inválido, se corta el flujo y se muestran los errores en consola.

- Antes de enviar, se normalizan las tags a un array de strings en minúsculas.

## 🎨 UI y mensajes de error
Cada campo se acompaña de un componente `<error-label>` que muestra mensajes de validación con un ícono SVG elegante:

```html
<div class="flex flex-col gap-1">
    <label class="font-semibold">Precio</label>
    <input
        type="number"
        placeholder="Precio"
        class="input input-bordered w-full"
        formControlName="price"
        [class.border-red-500]="productForm.get('price')?.errors ?? false"
    />
    <error-label [control]="productForm.get('price')!" />
</div>
```

Esto asegura:

- Inputs con borde rojo si hay error.

- Mensaje de error con ícono solo cuando el campo es inválido y fue tocado.

## ✅ Buenas prácticas aplicadas
- Agrupación visual: cada campo (label + input + error) está en un flex-col para mantener alineación.

- Validación robusta: se usan Validators y expresiones regulares claras.

- Transformación de datos: tags se normaliza antes de enviar.

- Feedback inmediato: errores visibles en UI y logs en consola para depuración.

## ⚡ Patrón de Caching Híbrido en `ProductsService`

El servicio de productos implementa un sistema de **caching híbrido** que combina:

- **Cache de colecciones** (`productsCache`) → almacena respuestas completas de listados (`ProductsResponse`).
- **Cache de entidades individuales** (`oneProductCache`) → almacena productos individuales (`Product`).

Este enfoque permite:
- Evitar llamadas redundantes al backend.
- Reutilizar datos ya cargados en memoria.
- Mantener consistencia entre vistas de lista y vistas de detalle.

---

### 🗂️ Cache de colecciones

```ts
private productsCache = new Map<string, ProductsResponse>();

getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 8, offset = 0, gender = '' } = options;
    const key = `${limit}-${offset}-${gender}`;

    if (this.productsCache.has(key)) {
        return of(this.productsCache.get(key)!);
    }

    return this.http.get<ProductsResponse>(`${baseUrl}/products`, {
        params: { limit, offset, gender }
    }).pipe(
        tap(res => this.productsCache.set(key, res))
    );
}
```

- La clave del cache se construye con limit-offset-gender.

- Si la respuesta ya existe, se devuelve desde memoria.

- Si no, se hace la petición HTTP y se guarda en cache.

## 🎯 Cache de entidades individuales
```ts
private oneProductCache = new Map<string, Product>();

getProductById(id: string): Observable<Product> {
    if (this.oneProductCache.has(id)) {
        return of(this.oneProductCache.get(id)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
        tap(prod => this.oneProductCache.set(id, prod))
    );
}
```

- Cada producto se guarda en cache con su id como clave.

- Esto evita volver a pedir el mismo producto al backend.

## 🔄 Actualización del cache tras un `update`
```ts
updateProduct(id: string, productLike: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike).pipe(
        tap(updated => this.updateProductCache(updated))
    );
}

updateProductCache(product: Product) {
    this.oneProductCache.set(product.id, product);
}
```

- Tras actualizar un producto en el backend, se refresca el cache individual.

- Esto asegura que la próxima vez que se consulte ese producto, se obtenga la versión más reciente sin necesidad de otra petición.

## ✅ Buenas prácticas aplicadas
- Separación de responsabilidades:

- productsCache → colecciones.

- oneProductCache → entidades individuales.

Consistencia:

- Al actualizar un producto, se refresca el cache individual.

- Opcionalmente, se puede sincronizar también dentro de productsCache si se desea mantener listas actualizadas.

Escalabilidad:

- Este patrón permite crecer hacia invalidación de cache, expiración por TTL o sincronización en tiempo real.

## 🔖 Nota: 
Si se requiere que los listados reflejen inmediatamente los cambios de un producto actualizado, se puede extender updateProductCache para reemplazar el producto dentro de cualquier ProductsResponse cacheado.

## 🔄 Sincronización de paginación al cambiar el límite de productos

Cuando el usuario cambia el número de productos por página (`limit`), se reinicia automáticamente la página actual (`currentPage`) a `1` y se actualiza la URL con `?page=1`. Esto asegura que:

- El `offset` calculado sea válido.
- La UI no quede en una página inexistente.
- Las flechas de navegación funcionen correctamente.

### 🧩 Implementación

```ts
onLimitChange(limit: number) {
    this.productsPerPage.set(limit);
    this.pagination.currentPage.set(1);

    this.router.navigate([], {
        queryParams: { page: 1 },
        queryParamsHandling: 'merge'
    });
}
```
## 🧩 Patrón: Card uniforme con imagen adaptable

Este patrón asegura que todas las tarjetas de producto mantengan una altura visual consistente, sin importar el tamaño o proporción de la imagen original.

### ✅ Características
- `min-h-96` en la card para altura mínima uniforme
- `h-96` en el contenedor de imagen para espacio fijo
- `object-cover` para escalar la imagen sin deformarla
- `flex-col` y `flex-grow` para distribuir contenido verticalmente
- `overflow-hidden` para evitar desbordes

### 💡 Ejemplo

```html
<div class="card min-h-96 flex flex-col bg-gray-800 shadow-2xl border border-gray-700 overflow-hidden">
  <figure class="h-96 overflow-hidden">
    <img
      [ngSrc]="product().images | productImage"
      [alt]="product().title"
      width="10"
      height="10"
      priority
      class="w-full h-full rounded-t-lg object-cover"
    />
  </figure>
  <div class="card-body flex flex-col justify-between flex-grow">
    <div>
      <a [routerLink]="['/product', product().slug]" class="text-info hover:underline">
        <h2 class="card-title">{{ product().title | slice:0:20 }}...</h2>
      </a>
      <p>{{ product().description | slice:0:60 }}...</p>
    </div>
    <div class="card-actions justify-end">
      <a [routerLink]="['/product', product().slug]" class="btn btn-outline text-info">
        Ver Producto
      </a>
    </div>
  </div>
</div>
```
