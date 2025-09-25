import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { ProductsService } from '@products/services/products.service';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';


@Component({
    selector: 'home-page',
    imports: [ProductCardComponent],
    templateUrl: './home-page.component.html',
})
export class HomePageComponent {

    productsService = inject(ProductsService)

    productsResource = rxResource({
        stream: () => this.productsService.getProducts({})
    })
}
