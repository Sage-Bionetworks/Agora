import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Gene, GeneInfo } from '../../../models';

import { GeneService } from '../../../core/services';

@Component({
    selector: 'soe',
    templateUrl: './soe.component.html',
    styleUrls: [ './soe.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class SOEComponent implements OnInit {
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

        // Adds the summary entries
        this.initData();
    }

    initData() {
        this.summary = [
            {
                property: 'Genetic Association with LOAD',
                state: (this.geneInfo.isIGAP === undefined) ? false : this.geneInfo.isIGAP,
                hasLink: false,
                extraText: ''
            },
            {
                property: 'Brain eQTL',
                state: (this.geneInfo.haseqtl === undefined) ? false : this.geneInfo.haseqtl,
                hasLink: false,
                extraText: ''
            },
            {
                property: 'RNA Expression Change in AD Brain',
                state: (this.geneInfo.isChangedInADBrain === undefined) ?
                    false : this.geneInfo.isChangedInADBrain,
                hasLink: false,
                extraText: ''
            },
            {
                property: 'Nominated Target',
                state: (this.geneInfo.nominations === undefined) ?
                    false : this.geneInfo.nominations,
                hasLink: false,
                extraText: ''
            },
            {
                property: 'Gene Ontology',
                state: true,
                hasLink: true,
                extraText: 'Visit Ensembl',
                command: (event) => this.viewGeneOntology()
            },
            {
                property: 'Reactome Pathways',
                state: true,
                hasLink: true,
                extraText: 'Visit Ensembl',
                command: (event) => this.viewPathways()
            },
            {
                property: 'Evidence for AD Association',
                state: true,
                hasLink: true,
                extraText: 'Visit Open Targets',
                command: (event) => this.viewHallmarks()
            },
            {
                property: 'Cell Type Specificity',
                state: true,
                hasLink: true,
                extraText: 'Visit Brain RNAseq',
                command: (event) => this.viewBrainRNAseq()
            },
            {
                property: 'Genetic Evidence',
                state: true,
                hasLink: true,
                extraText: 'Visit Alzheimer\'s Genomics Database',
                command: (event) => this.viewGenomicsDatabase()
            },
            {
                property: 'Association with Hallmarks of AD',
                state: false,
                hasLink: false,
                extraText: 'Coming Soon'
            },
            {
                property: 'Protein Expression Change in AD Brain',
                state: false,
                hasLink: false,
                extraText: 'Coming Soon'
            }
        ];

        this.cols = [
            { field: 'property', header: 'Property' },
            { field: 'state', header: 'State' }
        ];
    }

    getText(state?: boolean): string {
        let text = '';
        if (state) {
            text = 'True';
        } else {
            if (state === undefined) {
                text = 'No data';
            } else {
                text = 'False';
            }
        }
        return text;
    }

    getTextColorClass(state: boolean, normal?: boolean): any {
        const colorClassObj = {} as any;
        // The empty string is also a truthy value
        if (state) {
            colorClassObj['green-text'] = true;
        } else {
            colorClassObj['red-text'] = true;
        }

        if (normal) {
            colorClassObj['normal-heading'] = true;
        } else {
            colorClassObj['italic-heading'] = true;
        }
        return colorClassObj;
    }

    viewGeneOntology() {
        window.open('https://www.ensembl.org/Homo_sapiens/Gene/Ontologies/molecular_function?g=' +
            this.gene.ensembl_gene_id, '_blank');
    }

    viewPathways() {
        window.open('https://www.ensembl.org/Homo_sapiens/Gene/Pathway?g=' +
            this.gene.ensembl_gene_id, '_blank');
    }

    viewHallmarks() {
        window.open('https://www.targetvalidation.org/evidence/' +
            this.gene.ensembl_gene_id + '/EFO_0000249', '_blank'
        );
    }

    viewBrainRNAseq() {
        window.open('http://www.brainrnaseq.org/', '_blank');
    }

    viewGenomicsDatabase() {
        window.open('https://www.niagads.org/genomics/showRecord.do?name=GeneRecordClasses.' +
            'GeneRecordClass&source_id=' + this.gene.ensembl_gene_id, '_blank'
        );
    }
}
