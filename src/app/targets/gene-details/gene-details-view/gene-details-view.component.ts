import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BreadcrumbService } from '../../../core/services';
import { GeneService } from '../../services';

import { Gene } from '../../../models';

@Component({
    selector: 'gene-details-view',
    templateUrl: './gene-details-view.component.html',
    styleUrls: [ './gene-details-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneDetailsViewComponent implements OnInit {
    private sub: any;

    id: string;
    gene: Gene;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private breadcrumb: BreadcrumbService,
        private geneService: GeneService
    ) { }

    ngOnInit() {
        let crumbs = [
            { label: 'TARGETS', routerLink: ['/targets'] }
        ];

        this.gene = this.geneService.getCurrentGene()
        if (!this.gene) {
            this.router.navigate(['/targets']);
        } else {
            this.id = this.route.snapshot.paramMap.get('id');
            crumbs.push({ label: this.gene.hgnc_symbol.toUpperCase(), routerLink: ['/gene-details/' + this.id] });
        }
        this.breadcrumb.setCrumbs(crumbs);
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets], {relativeTo: this.route}) : this.router.navigate([path], {relativeTo: this.route});
    }
}
