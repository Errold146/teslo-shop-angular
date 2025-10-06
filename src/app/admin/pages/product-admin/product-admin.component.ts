import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';

import { ProductsService } from '@products/services/products.service';
import { ProductDetailsComponent } from "./product-details/product-details.component";

@Component({
    selector: 'product-admin',
    imports: [ProductDetailsComponent],
    templateUrl: './product-admin.component.html',
})
export class ProductAdminComponent {

    router = inject(Router)
    activateRoute = inject(ActivatedRoute)
    productService = inject(ProductsService)

    productId = toSignal(
        this.activateRoute.params.pipe(
            map( params => params['id'] )
        )
    )

    productResource = rxResource({
        stream: () => this.productService.getProductById(this.productId())
    })

    redirectEffect = effect(() => {
        if ( this.productResource.error() ) {
            this.router.navigate(['/admin/products'])
        }
    })
}
