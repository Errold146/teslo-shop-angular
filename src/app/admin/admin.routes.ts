import { Routes } from "@angular/router";

import { IsAdminGuard } from "./guards/is-admin.guard";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { ProductAdminComponent } from "./pages/product-admin/product-admin.component";
import { ProductsAdminComponent } from "./pages/products-admin/products-admin.component";

const adminRoutes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        canMatch: [
            IsAdminGuard
        ],
        children: [
            {
                path: 'products',
                component: ProductsAdminComponent
            },
            {
                path: 'product/:id',
                component: ProductAdminComponent
            },
            {
                path: '**',
                redirectTo: 'products'
            }
        ]
    }
]

export default adminRoutes
