import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { Component, inject } from '@angular/core';

import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { ProductCardComponent } from '@products/components/product-card/product-card.component';

@Component({
    selector: 'home-page',
    imports: [ProductCardComponent, PaginationComponent],
    templateUrl: './home-page.component.html',
})
export class HomePageComponent {

    private productsService = inject(ProductsService);
    private route = inject(ActivatedRoute);
    pagination = inject(PaginationService);

    productsResource = rxResource({
        stream: () => this.route.queryParams.pipe(
            switchMap(params => {
                const page = +params['page'] || 1;
                this.pagination.currentPage.set(page);
                const offset = this.pagination.offset();
                return this.productsService.getProducts({ limit: this.pagination.limit, offset });
            })
        )
    });
}

