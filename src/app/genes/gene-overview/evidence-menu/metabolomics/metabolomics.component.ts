import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Gene, GeneInfo } from '../../../../models';

import { GeneService } from '../../../../core/services';

import * as d3 from 'd3';

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

    constructor(
        private route: ActivatedRoute,
        private geneService: GeneService
    ) {}

    ngOnInit() {
        if (!this.gene) { this.gene = this.geneService.getCurrentGene(); }
        if (!this.geneInfo) { this.geneInfo = this.geneService.getCurrentInfo(); }

        if (!this.id) { this.id = this.route.snapshot.paramMap.get('id'); }
    }
}
