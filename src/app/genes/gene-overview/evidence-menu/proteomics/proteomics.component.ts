import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { Gene, GeneInfo } from '../../../../models';

import { GeneService } from '../../../../core/services';

@Component({
    selector: 'proteomics',
    templateUrl: './proteomics.component.html',
    styleUrls: [ './proteomics.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class ProteomicsComponent implements OnInit {
    @Input() gene: Gene;
    @Input() geneInfo: GeneInfo;
    @Input() id: string;
    @Input() placeholderUrl: string = '/assets/img/placeholder_member.png';

    dataLoaded: boolean = false;
    memberImages: any[] = [];

    constructor(
        private geneService: GeneService
    ) {}

    ngOnInit() {
        //
    }

    getInfoState() {
        return this.geneService.getInfoDataState();
    }
}
