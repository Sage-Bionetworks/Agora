import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Gene } from '../../../shared/models';

import { GeneService } from '../../services';

@Component({
    selector: 'gene-oddi-druggability',
    templateUrl: './gene-oddi-druggability.component.html',
    styleUrls: [ './gene-oddi-druggability.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneODDIDrugabilityComponent implements OnInit {
    @Input() styleClass: string = 'oddi-panel';
    @Input() style: any;
    @Input() gene: Gene;

    constructor(
        private router: Router,
        private geneService: GeneService
    ) { }

    ngOnInit() {
    }
}
