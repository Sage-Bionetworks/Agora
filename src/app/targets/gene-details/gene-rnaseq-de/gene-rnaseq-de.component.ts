import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Gene } from '../../../shared/models';

import { GeneService } from '../../services';

@Component({
    selector: 'gene-rnaseq-de',
    templateUrl: './gene-rnaseq-de.component.html',
    styleUrls: [ './gene-rnaseq-de.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneRNASeqDEComponent implements OnInit {
    @Input() styleClass: string = 'rnaseq-panel';
    @Input() style: any;
    @Input() gene: Gene;
    @Input() tissues: string[];

    selectedTissue: string;
    selectedModel: string;

    constructor(
        private router: Router,
        private geneService: GeneService
    ) { }

    ngOnInit() {
        this.tissues = this.geneService.getTissues();
        console.log(this.tissues);
    }
}
