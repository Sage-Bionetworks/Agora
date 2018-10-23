import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneInfo } from '../../../models';

import { GeneService } from '../../../core/services';

@Component({
    selector: 'gene-druggability',
    templateUrl: './gene-druggability.component.html',
    styleUrls: [ './gene-druggability.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneDruggabilityComponent implements OnInit {
    @Input() geneInfo: GeneInfo;
    druggability: any;

    constructor(
        private router: Router,
        private geneService: GeneService
    ) {}

    ngOnInit() {
        this.geneInfo = this.geneService.getCurrentInfo();
        console.log(this.geneInfo);
        if (this.geneInfo.druggability) {
            this.druggability = this.geneInfo.druggability[0];
        }
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets]) : this.router.navigate([path]);
    }
}
