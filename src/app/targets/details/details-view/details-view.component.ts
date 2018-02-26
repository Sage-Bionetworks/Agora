import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { BreadcrumbService } from '../../../core/services';
import { GeneService } from '../../services';

@Component({
    selector: 'details-view',
    templateUrl: './details-view.component.html',
    styleUrls: [ './details-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class DetailsViewComponent implements OnInit {
    id: number;

    constructor(
        private router: Router,
        private breadcrumb: BreadcrumbService,
        private geneService: GeneService
    ) { }

    ngOnInit() {
        this.breadcrumb.setCrumbs([
            { label: 'TARGETS', routerLink: ['/targets'] },
            { label: this.geneService.getCurrentGene().hgnc_symbol.toUpperCase(), routerLink: ['/details/' + this.id] }
        ])
    }
}
