import { map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';

import { GenderMap } from '@/utilsgender-map';
import { ProductsService } from '@products/services/products.service';
import { Gender, ProductsResponse } from '@products/interfaces/product.interface';
import { ProductCardComponent } from "@products/components/product-card/product-card.component";

@Component({
    selector: 'gender-page',
    imports: [ProductCardComponent],
    templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {

    private route = inject(ActivatedRoute)
    private productsService = inject(ProductsService)
    genderMap = GenderMap

    getGenderLabel(gender: string) {
        return this.genderMap[gender as Gender]
    }


    gender = toSignal(
        this.route.params.pipe(
            map(({ gender }) => gender as string)
        ),
        { initialValue: 'men' } // 👈 evita undefined inicial
    )

    productsResource = rxResource<ProductsResponse, { gender: string }>({
        params: () => ({ gender: this.gender() }),
        stream: (params) =>
            this.productsService.getProducts({ gender: (params as any).request.gender })
    })

}
