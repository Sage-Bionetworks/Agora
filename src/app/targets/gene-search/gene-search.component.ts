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

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dataService: DataService,
        private geneService: GeneService
    ) { }

    ngOnInit() {
        this.genes = this.dataService.getTableData();
    }

    viewGene() {
        let gene = this.geneService.getCurrentGene();
        if (gene) this.router.navigate(['gene-details', gene.ensembl_gene_id], {relativeTo: this.route});
    }

    onChange(event: Gene) {
        this.geneService.setCurrentGene(event);
    }
}
