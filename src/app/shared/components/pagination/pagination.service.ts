import { ActivatedRoute, Router } from '@angular/router';
import { Injectable, inject, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaginationService {
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    limit = 8;
    currentPage = signal(1);
    totalPages = signal(0);

    offset = computed(() => (this.currentPage() - 1) * this.limit);

    setTotalPages(pages: number) {
        this.totalPages.set(pages);
    }

    setPage(page: number) {
        if (page < 1 || page > this.totalPages()) return;
        this.currentPage.set(page);
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page },
            queryParamsHandling: 'merge'
        });
    }

    nextPage() {
        this.setPage(this.currentPage() + 1);
    }

    prevPage() {
        this.setPage(this.currentPage() - 1);
    }
}
