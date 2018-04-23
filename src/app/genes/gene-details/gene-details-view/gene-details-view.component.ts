import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
    BreadcrumbService,
    GeneService,
    DataService
} from '../../../core/services';

import { Gene } from '../../../models';

@Component({
    selector: 'gene-details-view',
    templateUrl: './gene-details-view.component.html',
    styleUrls: [ './gene-details-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneDetailsViewComponent implements OnInit {
    id: string;
    // Change to smaller object, name based
    gene: Gene;
    geneInfo: Gene[];
    models: string[] = [];
    tissues: string[] = [];
    dataLoaded: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private breadcrumb: BreadcrumbService,
        private geneService: GeneService,
        private dataService: DataService
    ) { }

    ngOnInit() {
        // Get the current clicked gene
        this.gene = this.geneService.getCurrentGene();

        // Crumb logic after getting the current gene
        let crumbs = [
            { label: 'TARGETS', routerLink: ['/genes'] }
        ];
        if (!this.gene) {
            this.router.navigate(['/genes']);
        } else {
            this.id = this.route.snapshot.paramMap.get('id');
            crumbs.push({ label: this.gene.hgnc_symbol.toUpperCase(), routerLink: ['/gene-details/' + this.id] });

            this.dataService.loadGenes().then((loaded) => {
                if (loaded) {
                    this.geneService.filterTissuesModels(this.gene).then((loaded: boolean) => {
                        this.dataLoaded = loaded;
                    });
                }
                // Handle error later
            });
        }
        this.breadcrumb.setCrumbs(crumbs);
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets], {relativeTo: this.route}) : this.router.navigate([path], {relativeTo: this.route});
    }
}
