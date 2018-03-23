import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
    BreadcrumbService,
    GeneService
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

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private breadcrumb: BreadcrumbService,
        private geneService: GeneService
    ) { }

    ngOnInit() {
        // Get the current clicked gene
        this.gene = this.geneService.getCurrentGene();

        // Crumb logic after getting the current gene
        let crumbs = [
            { label: 'TARGETS', routerLink: ['/targets'] }
        ];
        if (!this.gene) {
            this.router.navigate(['/targets']);
        } else {
            this.id = this.route.snapshot.paramMap.get('id');
            crumbs.push({ label: this.gene.hgnc_symbol.toUpperCase(), routerLink: ['/gene-details/' + this.id] });

            // Filter the genes based on the current selection
            //this.geneService.filterGenes(this.gene.hgnc_symbol);
            /*if (this.geneInfo.length) {
                this.geneInfo.forEach(i => {
                    this.models.push(i.comparison_model_sex);
                    this.tissues.push(i.tissue_study_pretty);
                });

                this.models = this.models.filter((m, index, self) => {
                    return self.indexOf(m) === index;
                });
                this.tissues = this.tissues.filter((t, index, self) => {
                    return self.indexOf(t) === index;
                });
                this.geneService.loadPlotGenes(this.tissues, this.models);
            }*/
        }
        this.breadcrumb.setCrumbs(crumbs);
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets], {relativeTo: this.route}) : this.router.navigate([path], {relativeTo: this.route});
    }
}
