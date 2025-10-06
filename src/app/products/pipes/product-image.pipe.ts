import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl

@Pipe({
    name: 'productImage'
})
export class ProductImagePipe implements PipeTransform {
    transform(value: null | string | string[]): string {

        if ( value === null ) return '/nophoto.jpg';

        if ( typeof value === 'string' && value.startsWith('blob:') ) return value;

        if ( typeof value === 'string' ) return `${baseUrl}/files/product/${value}`;

        const image = value[0]
        if ( !image ) return '/nophoto.jpg';

        return `${baseUrl}/files/product/${image}`;
    }
}
