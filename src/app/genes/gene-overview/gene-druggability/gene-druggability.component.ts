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
    buckets: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    currentBucket: number = 1;
    classes: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];

    constructor(
        private route: ActivatedRoute,
        private geneService: GeneService
    ) {}

    ngOnInit() {
        if (!this.gene) { this.gene = this.geneService.getCurrentGene(); }
        if (!this.geneInfo) { this.geneInfo = this.geneService.getCurrentInfo(); }

        if (!this.id) { this.id = this.route.snapshot.paramMap.get('id'); }
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
                return '#90D098';
            case 3:
                return '#8DD485';
            case 4:
                return '#98D97A';
            case 5:
                return '#A9DD6F';
            case 6:
                return '#C1E163';
            case 7:
                return '#E0E656';
            case 8:
                return '#EACD49';
            case 9:
                return '#EEA83C';
            case 10:
                return '#F37A2E';
            case 11:
                return '#F4884A';
            case 12:
                return '#E16560';
            case 13:
                return '#C3C7D1';
            case 14:
                return '#AFDDDF';
            default:
                return '#FFFFFF';
        }
    }

    getClassText(bucket: number): any {
        switch (bucket) {
            case 1:
                return 'Class A';
            case 2:
            case 3:
            case 4:
                return 'Class B';
            case 5:
            case 6:
                return 'Class C';
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
                return 'Class D';
            case 12:
            case 13:
                return 'Class E';
            case 14:
                return 'Class F';
            default:
                return 'Class A';
        }
    }

    setCurrentBucket(bucket: number) {
        this.currentBucket = bucket;
    }
}
