import { Component, input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-pagination',
    imports: [],
    templateUrl: './pagination.component.html',
})
export class PaginationComponent {

    pages = input(0);
    currentPage = input<number>(1);

    constructor(private router: Router, private route: ActivatedRoute) {}

    goToPage(page: number) {
        if (page < 1 || page > this.pages()) return;
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page },
            queryParamsHandling: 'merge', // mantiene otros params
        });
    }

    prevPage() {
        this.goToPage(this.currentPage() - 1);
    }

    nextPage() {
        this.goToPage(this.currentPage() + 1);
    }
}
