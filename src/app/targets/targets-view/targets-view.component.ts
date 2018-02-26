import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { BreadcrumbService } from '../../core/services';
import { GeneService } from '../services';

@Component({
    selector: 'targets-view',
    templateUrl: './targets-view.component.html',
    styleUrls: [ './targets-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class TargetsViewComponent implements OnInit {

    constructor(
        private router: Router,
        private breadcrumb: BreadcrumbService,
        private geneService: GeneService
    ) { }

    ngOnInit() {
        this.breadcrumb.setCrumbs([
            { label: 'TARGETS', routerLink: ['/targets'] }
        ])
    }

    viewGene() {
        this.router.navigate(['/details', this.geneService.getCurrentGene().ensembl_gene_id]);
    }
}
