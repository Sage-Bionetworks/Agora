import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Gene } from '../../models';

import { BreadcrumbService } from '../../core/services';
import { GeneService } from '../../core/services';

import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'targets-view',
    templateUrl: './targets-view.component.html',
    styleUrls: [ './targets-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class TargetsViewComponent implements OnInit {
    genes$: Observable<Gene[]>;

    dataLoaded: boolean = false;

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

        // To be removed when the real application is done
        this.genes$ = this.geneService.loadGenesFile('sampleData.json');
        this.genes$.subscribe(data => {
            this.geneService.setGenes(data);
            this.dataLoaded = true;
        });
    }

    viewGene() {
        this.router.navigate(['gene-details', this.geneService.getCurrentGene().ensembl_gene_id], {relativeTo: this.route});
    }
}
