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
                    'No Data' :
                    this.getDruggabilityText(this.geneInfo.druggability[0].sm_druggability_bucket)
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

    getDruggabilityTitle(bucket: number): string {
        switch (bucket) {
            case 1:
                return 'SM Druggable';
            case 2:
            case 3:
            case 4:
                return 'Targetable by Homology';
            case 5:
            case 6:
                return 'Probably SM Druggable';
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
                return 'Potentially Targetable by Protein Family Structure';
            case 12:
            case 13:
                return 'Potentially Low Ligandability';
            case 14:
                return 'Non-Protein Target';
            default:
                return '';
        }
    }

    getDruggabilityText(bucket: number): string {
        switch (bucket) {
            case 1:
                return 'Protein with a SM ligand identified from' +
                    ' ChEMBL, meeting TCRD activity criteria';
            case 2:
            case 3:
            case 4:
                return '>=4-% homologous to a protein with' +
                    ' a SM ligand identified from ChEMBL, meeting TCRD activity criteria';
            case 5:
            case 6:
                return 'Protein with a SM ligand identified' +
                    ' from ChEMBL data, but the ligand does not meet TCRD activity criteria';
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
                return 'Is a member' +
                ' of a gene family which has a protein member with a druggable pocket in' +
                ' the protein structure';
            case 12:
            case 13:
                return 'Has a structure but there is no' +
                ' evidence of a druggable pocket';
            case 14:
                return 'Non-Protein Target<br>New modality indicated';
            default:
                return '';
        }
    }

    getBucketStyle(bucket: number): any {
        switch (bucket) {
            case 1:
                return '#9ACCAB';
            case 2:
            case 3:
            case 4:
                return '#F8CC7D';
            case 5:
            case 6:
                return '#F1A86F';
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
                return '#EFA0C5';
            case 12:
            case 13:
                return '#C3C7D1';
            case 14:
                return '#AFDDDF';
            default:
                return '#FFFFFF';
        }
    }
}
