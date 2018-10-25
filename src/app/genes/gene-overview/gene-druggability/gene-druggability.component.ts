import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Gene, GeneInfo } from '../../../models';

import { GeneService } from '../../../core/services';

@Component({
    selector: 'gene-druggability',
    templateUrl: './gene-druggability.component.html',
    styleUrls: [ './gene-druggability.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneDruggabilityComponent implements OnInit {
    @Input() gene: Gene;
    @Input() geneInfo: GeneInfo;
    @Input() id: string;

    cols: any[];
    summary: any[];

    constructor(
        private route: ActivatedRoute,
        private geneService: GeneService
    ) {}

    ngOnInit() {
        if (!this.gene) { this.gene = this.geneService.getCurrentGene(); }
        if (!this.geneInfo) { this.geneInfo = this.geneService.getCurrentInfo(); }

        if (!this.id) { this.id = this.route.snapshot.paramMap.get('id'); }

        this.summary = [
            {
                property: 'Small Molecule Druggability Bucket',
                value: (this.geneInfo.druggability[0].sm_druggability_bucket === undefined) ?
                    'No Data' : this.geneInfo.druggability[0].sm_druggability_bucket
            },
            {
                property: 'Classification',
                value: (this.geneInfo.druggability[0].classification === undefined) ?
                    'No Data' : this.geneInfo.druggability[0].classification
            },
            {
                property: 'Druggable Class',
                value: (this.geneInfo.druggability[0].druggable_class === undefined) ?
                    'No Data' : this.geneInfo.druggability[0].druggable_class
            },
            {
                property: 'Pharos Class',
                value: (this.geneInfo.druggability[0].pharos_class === undefined) ?
                    'No Data' : this.geneInfo.druggability[0].pharos_class
            }
        ];

        this.cols = [
            { field: 'property', header: 'Property' },
            { field: 'value', header: 'Value' }
        ];
    }
}
