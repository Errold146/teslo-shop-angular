import { NgOptimizedImage, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Component, computed, input } from '@angular/core';

import { environment } from 'src/environments/environment';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from "../../pipes/product-image.pipe";

const baseUrl = environment.baseUrl

@Component({
    selector: 'product-card',
    imports: [RouterLink, SlicePipe, NgOptimizedImage, ProductImagePipe],
    templateUrl: './product-card.component.html',
})
export class ProductCardComponent {

    product = input.required<Product>()

    imageUrl = computed(() => {
        return `${ baseUrl }/files/product/${ this.product().images[0]}`
    })
}
