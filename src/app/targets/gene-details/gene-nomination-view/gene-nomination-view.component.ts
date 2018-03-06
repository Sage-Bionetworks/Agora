import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Gene } from '../../../models';

import { GeneService } from '../../services';

@Component({
    selector: 'gene-nomination-view',
    templateUrl: './gene-nomination-view.component.html',
    styleUrls: [ './gene-nomination-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneNominationViewComponent implements OnInit {
    @Input() styleClass: string = 'nom-panel';
    @Input() style: any;
    @Input() gene: Gene;
    @Input() id: string;

    constructor(
        private router: Router,
        private geneService: GeneService
    ) { }

    ngOnInit() {}
}
