import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Gene } from '../../../models';

import { GeneService } from '../../services';

@Component({
    selector: 'gene-lilly-drugebility',
    templateUrl: './gene-lilly-drugebility.component.html',
    styleUrls: [ './gene-lilly-drugebility.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneLillyDrugEBIlityComponent implements OnInit {
    @Input() styleClass: string = 'lilly-ebi-panel';
    @Input() style: any;
    @Input() gene: Gene;
    @Input() id: string;

    constructor(
        private router: Router,
        private geneService: GeneService
    ) { }

    ngOnInit() {
    }
}
