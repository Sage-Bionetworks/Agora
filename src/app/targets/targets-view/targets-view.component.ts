import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
        private route: ActivatedRoute,
        private breadcrumb: BreadcrumbService,
        private geneService: GeneService
    ) { }

    ngOnInit() {
        this.breadcrumb.setCrumbs([
            { label: 'TARGETS', routerLink: ['/targets'] }
        ])
    }

    viewGene() {
        this.router.navigate(['gene-details', this.geneService.getCurrentGene().ensembl_gene_id], {relativeTo: this.route});
    }
}
