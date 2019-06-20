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
                return 'Small molecule druggable';
            case 2:
                return 'Targetable by Homology';
            case 3:
                return 'Targetable by structure';
            case 4:
                return 'Targetable by homologous structure';
            case 5:
                return 'Probably small molecule druggable';
            case 6:
                return 'Probably small molecule druggable by homology';
            case 7:
                return 'Potentially small molecule druggable by family (active ligand)';
            case 8:
                return 'Potentially small molecule druggable by family (low activity ligand)';
            case 9:
                return 'Potentially targetable by protein family structure';
            case 10:
                return 'Endogenous ligand';
            case 11:
                return 'Druggable protein class, no other information';
            case 12:
                return 'Potentially low ligandability';
            case 13:
                return 'Unknown';
            case 14:
                return 'Non-protein target';
            default:
                return '';
        }
    }

    getDruggabilityText(bucket: number): string {
        switch (bucket) {
            case 1:
                return 'Protein with a small molecule ligand identified from ChEMBL, meeting ' +
                'TCRD activity criteria';
            case 2:
                return '>=40% homologous to a protein with a small molecule ligand identified ' +
                'from ChEMBL, meeting TCRD activity criteria';
            case 3:
                return 'Structurally druggable protein, based on the presence of a druggable ' +
                'pocket in the protein (DrugEBIlity/CanSAR)';
            case 4:
                return '>=40% homologous to a structurally druggable protein, based on the ' +
                'presence of a druggable pocket in the homologous protein (DrugEBIlity/CanSAR)';
            case 5:
                return 'Protein with a small molecule ligand identified from ChEMBL data, but ' +
                'the ligand does not meeting TCRD activity criteria';
            case 6:
                return '>=40% homologous to a protein with a small molecule ligand identified ' +
                'from ChEMBL data, but the ligand does not meeting TCRD activity criteria';
            case 7:
                return 'Is a member of a gene family which has a member with an small molecule ' +
                'ligand identified from ChEMBL data, meeting TCRD activity criteria';
            case 8:
                return 'Is a member of a gene family which has a protein member with a ligand ' +
                'which does not meet TCRD activity criteria';
            case 9:
                return 'is a member of a gene family which has a protein member with a druggable ' +
                'pocket in the protein structure';
            case 10:
                return 'Has an identified endogenous ligand according from IUPHAR';
            case 11:
                return 'Is a member of a PHAROS druggable class of protein (enzyme, receptor, ' +
                'ion channel, nuclear hormone receptor, kinase) but does not meet any of the ' +
                'criteria above';
            case 12:
                return 'Has a structure but there is no evidence of a druggable pocket';
            case 13:
                return 'There is no information on ligands or structure in any of the categories ' +
                'above';
            case 14:
                return 'New modality indicated';
            default:
                return '';
        }
    }

    getBucketTextColor(bucket: number): string {
        return (bucket < 13) ? '#FFFFFF' : '#000000';
    }

    getBucketStyle(bucket: number): string {
        switch (bucket) {
            case 1:
                return '#20A386';
            case 2:
                return '#1F968B';
            case 3:
                return '#238A8D';
            case 4:
                return '#277D8E';
            case 5:
                return '#2D708E';
            case 6:
                return '#32648E';
            case 7:
                return '#39558C';
            case 8:
                return '#3F4788';
            case 9:
                return '#453781';
            case 10:
                return '#482677';
            case 11:
                return '#481568';
            case 12:
                return '#440D54';
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
