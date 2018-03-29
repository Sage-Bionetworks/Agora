import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Gene } from '../../models';

import {
    BreadcrumbService,
    GeneService,
    DataService
} from '../../core/services';

@Component({
    selector: 'gene-search',
    templateUrl: './gene-search.component.html',
    styleUrls: [ './gene-search.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneSearchComponent implements OnInit {
    @Input() fname: string;
    @Input() styleClass: string = '';
    @Input() style: any;
    @Input() genes: Gene[];

    private gene: Gene;

    geneId;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dataService: DataService,
        private geneService: GeneService
    ) { }

    ngOnInit() {
        this.genes = this.dataService.getTableData();
    }

    getGeneId() {
        return this.gene.hgnc_symbol;
    }

    viewGene() {
        this.gene = this.geneService.getCurrentGene();
        if (this.gene) this.router.navigate(['gene-details', this.gene.hgnc_symbol], {relativeTo: this.route});
    }

    onChange(gene: Gene) {
        this.geneId = gene.hgnc_symbol;
        this.geneService.setCurrentGene(gene);
    }
}
