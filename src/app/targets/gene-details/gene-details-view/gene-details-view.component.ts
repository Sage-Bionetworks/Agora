import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { BreadcrumbService } from '../../../core/services';
import { GeneService } from '../../services';

@Component({
    selector: 'gene-details-view',
    templateUrl: './gene-details-view.component.html',
    styleUrls: [ './gene-details-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneDetailsViewComponent implements OnInit {
    id: number;

    constructor(
        private router: Router,
        private breadcrumb: BreadcrumbService,
        private geneService: GeneService
    ) { }

    ngOnInit() {
        let crumbs = [
            { label: 'TARGETS', routerLink: ['/targets'] }
        ];

        if (!this.geneService.getCurrentGene()) {
            this.router.navigate(['/targets']);
        } else {
            crumbs.push({ label: this.geneService.getCurrentGene().hgnc_symbol.toUpperCase(), routerLink: ['/gene-details/' + this.id] });
        }
        this.breadcrumb.setCrumbs(crumbs);
    }
}
