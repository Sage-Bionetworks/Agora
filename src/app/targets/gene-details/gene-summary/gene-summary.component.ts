import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { BreadcrumbService } from '../../../core/services';
import { GeneService } from '../../services';

@Component({
    selector: 'gene-summary',
    templateUrl: './gene-summary.component.html',
    styleUrls: [ './gene-summary.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneSummaryComponent implements OnInit {
    id: number;

    constructor(
        private router: Router,
        private breadcrumb: BreadcrumbService,
        private geneService: GeneService
    ) { }

    ngOnInit() {

    }
}
