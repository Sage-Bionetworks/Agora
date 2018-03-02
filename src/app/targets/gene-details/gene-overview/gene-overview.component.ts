import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Gene } from '../../../shared/models';

import { BreadcrumbService } from '../../../core/services';
import { GeneService } from '../../services';

@Component({
    selector: 'gene-overview',
    templateUrl: './gene-overview.component.html',
    styleUrls: [ './gene-overview.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneOverviewComponent implements OnInit {
    @Input() styleClass: string = 'overview-panel';
    @Input() style: any;
    @Input() gene: Gene;
    id: number;

    constructor(
        private router: Router,
        private breadcrumb: BreadcrumbService,
        private geneService: GeneService
    ) { }

    ngOnInit() {
        if (!this.geneService.getCurrentGene()) {
            this.router.navigate(['/targets']);
        } else {
            this.gene = this.geneService.getCurrentGene();
        }
    }
}
