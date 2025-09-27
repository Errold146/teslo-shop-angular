import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';
import { combineLatest, map, switchMap, Observable } from 'rxjs';
import { rxResource, toSignal, toObservable } from '@angular/core/rxjs-interop';

import { GenderMap } from '@utils/gender-map';
import { ProductsService } from '@products/services/products.service';
import { Gender, ProductsResponse } from '@products/interfaces/product.interface';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { ProductCardComponent } from "@products/components/product-card/product-card.component";

@Component({
    selector: 'gender-page',
    imports: [ProductCardComponent, PaginationComponent],
    templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {

    private route = inject(ActivatedRoute);
    private productsService = inject(ProductsService);
    pagination = inject(PaginationService);

    genderMap = GenderMap;

    gender = toSignal(
        this.route.params.pipe(map(p => p['gender'] as string)),
        { initialValue: 'men' }
    );

    // 👇 observable tipado explícitamente
    gender$ = toObservable(this.gender) as Observable<string>;

    getGenderLabel(gender: string) {
        return this.genderMap[gender as Gender];
    }

    productsResource = rxResource<ProductsResponse, void>({
        stream: () => {
            const page$ = this.route.queryParams.pipe(
                map(q => Number(q['page'] ?? 1))
            );

            return combineLatest([this.gender$, page$]).pipe(
                switchMap(([gender, page]) => {
                    this.pagination.currentPage.set(page);
                    return this.productsService.getProducts({
                        gender,
                        limit: this.pagination.limit,
                        offset: this.pagination.offset()
                    });
                })
            );
        }
    });
}
