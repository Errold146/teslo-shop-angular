import { combineLatest, switchMap, tap } from 'rxjs';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { rxResource, toObservable } from '@angular/core/rxjs-interop';

import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { ProductTableComponent } from "@products/components/product-table/product-table.component";

@Component({
    selector: 'products-admin',
    imports: [ProductTableComponent, PaginationComponent, RouterLink],
    templateUrl: './products-admin.component.html',
})
export class ProductsAdminComponent {

    router = inject(Router)
    private route = inject(ActivatedRoute)
    pagination = inject(PaginationService)
    private productsService = inject(ProductsService)

    productsPerPage = signal(10)
    productsPerPage$ = toObservable(this.productsPerPage)

    productsResource = rxResource({
        stream: () => combineLatest([
            this.route.queryParams,
            this.productsPerPage$
        ]).pipe(
            switchMap(([params, limit]) => {
                const page = +params['page'] || 1
                this.pagination.currentPage.set(page)
                const offset = this.pagination.offset()
                return this.productsService.getProducts({ limit, offset }).pipe(
                    tap( resp => console.log('Productos Recibidos: ', resp))
                )
            })
        )
    });

    onLimitChange(limit: number) {
        this.productsPerPage.set(limit);
        this.pagination.currentPage.set(1);

        // ✅ Actualizar la URL con page=1
        this.router.navigate([], {
            queryParams: { page: 1 },
            queryParamsHandling: 'merge'
        });
    }
}
