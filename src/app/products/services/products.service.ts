import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';

import { User } from '@auth/interfaces/user.interface';
import { environment } from 'src/environments/environment';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';

const baseUrl = environment.baseUrl

interface Options {
    limit?: number
    offset?: number
    gender?: string
}

const emptyProduct: Product = {
    id: 'new',
    title: '',
    price: 0,
    description: '',
    slug: '',
    stock: 0,
    sizes: [],
    gender: Gender.Men,
    tags: [],
    images: [],
    user: {} as User
}

@Injectable({providedIn: 'root'})
export class ProductsService {

    private http = inject(HttpClient)

    private productsCache = new Map<string, ProductsResponse>()
    private oneProductCache = new Map<string, Product>()

    getProducts(options: Options): Observable<ProductsResponse> {

        const { limit = 8, offset = 0, gender = ''} = options

        const key = `${limit}-${offset}-${gender}`
        if ( this.productsCache.has(key) ) {
            return of(this.productsCache.get(key)!)
        }

        return this.http.get<ProductsResponse>(`${ baseUrl }/products`, {
            params: {
                limit,
                offset,
                gender
            }
        }).pipe(
            tap(res => this.productsCache.set(key, res))
        )
    }

    getProductByIdSlug(idSlug: string): Observable<Product> {

        if ( this.oneProductCache.has(idSlug) ) {
            return of(this.oneProductCache.get(idSlug)!)
        }

        return this.http
            .get<Product>(`${baseUrl}/products/${idSlug}`)
            .pipe(tap(prod => this.oneProductCache.set(idSlug, prod)))
    }

    getProductById(id: string): Observable<Product> {

        if ( id === 'new' ) return of(emptyProduct);

        if ( this.oneProductCache.has(id) ) {
            return of(this.oneProductCache.get(id)!)
        }

        return this.http
            .get<Product>(`${baseUrl}/products/${id}`)
            .pipe(tap(prod => this.oneProductCache.set(id, prod)))
    }

    updateProduct(
        id: string,
        productLike: Partial<Product>,
        imageFileList?: FileList
    ): Observable<Product> {

        const currentImages = productLike.images ?? []

        return this.uploadImages(imageFileList).pipe(
            map(imgName => ({
                ...productLike,
                images: [...currentImages, ...imgName]
            })),
            switchMap(
                updatedProduct => this.http.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct)
            ),
            tap(prod => this.updateProductCache(prod))
        )
    }

    createProduct(
        productLike: Partial<Product>,
        imageFileList?: FileList
    ): Observable<Product> {

        return this.uploadImages(imageFileList).pipe(
            map(imgNames => ({
                ...productLike,
                images: imgNames
            })),
            switchMap(productWithImages =>
                this.http.post<Product>(`${baseUrl}/products`, productWithImages)
            ),
            tap(prod => this.updateProductCache(prod))
        );
    }

    updateProductCache(product: Product) {

        const productId = product.id
        this.oneProductCache.set(productId, product)

        this.productsCache.forEach(prodRes => {
            prodRes.products = prodRes.products.map(
                currentProd => currentProd.id === productId ? product : currentProd
            )
        })
    }

    // Sube el FileList
    uploadImages(images?: FileList): Observable<string[]> {

        if ( !images ) return of([]);
        const uploadObservables = Array.from(images).map(img => this.uploadOneImage(img))

        return forkJoin(uploadObservables).pipe(
            tap(imageNames => console.log({imageNames}))
        )
    }

    uploadOneImage(imageFile: File): Observable<string> {
        const formData = new FormData()
        formData.append('file', imageFile)

        return this.http.post<{ fileName: string }>(`${baseUrl}/files/product`, formData).pipe(
            map(resp => resp.fileName)
        )
    }
}
