import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Gene, GeneInfo, Metabolomics } from '../../../../models';

import { GeneService, ApiService } from '../../../../core/services';

@Component({
    selector: 'metabolomics',
    templateUrl: './metabolomics.component.html',
    styleUrls: [ './metabolomics.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class MetabolomicsComponent implements OnInit {
    @Input() gene: Gene;
    @Input() geneInfo: GeneInfo;
    @Input() id: string;

    metabolomics: Metabolomics;
    dataLoaded: boolean = false;
    isEmptyGene: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private apiService: ApiService,
        private geneService: GeneService
    ) {}

    ngOnInit() {
        if (!this.gene) { this.gene = this.geneService.getCurrentGene(); }
        if (!this.geneInfo) { this.geneInfo = this.geneService.getCurrentInfo(); }

        if (this.gene && this.geneInfo) { this.isEmptyGene = false; }

        if (!this.id) { this.id = this.route.snapshot.paramMap.get('id'); }

        this.initData();
    }

    initData() {
        this.apiService.getGeneMetabolomics(this.geneService.getCurrentGene().ensembl_gene_id).
            subscribe((d: any) => {
            if (d.geneMetabolomics) {
                this.metabolomics = d.geneMetabolomics;
            } else {
                this.isEmptyGene = true;
            }

            this.dataLoaded = true;
        });
    }

    getSignificantText(pval: number): string {
        return (pval <= 0.05) ? ' is ' : ' is not ';
    }
}
