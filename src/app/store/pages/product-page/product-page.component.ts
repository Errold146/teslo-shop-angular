import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { ProductsService } from '@products/services/products.service';
import { ProductCarouselComponent } from "@products/components/product-carousel/product-carousel.component";

@Component({
    selector: 'product-page',
    imports: [ProductCarouselComponent],
    templateUrl: './product-page.component.html',
})
export class ProductPageComponent {

    activatedRoute = inject(ActivatedRoute)
    productService = inject(ProductsService)

    productIdSlug: string = this.activatedRoute.snapshot.params['idSlug']

    productResource = rxResource({
        stream: () => this.productService.getProductByIdSlug(this.productIdSlug)
    })
}
