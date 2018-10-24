import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Gene, GeneInfo } from '../../../models';

import {
    ApiService,
    GeneService
} from '../../../core/services';

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
        private router: Router,
        private route: ActivatedRoute,
        private geneService: GeneService
    ) {}

    ngOnInit() {
        if (!this.gene) { this.gene = this.geneService.getCurrentGene(); }
        if (!this.geneInfo) { this.geneInfo = this.geneService.getCurrentInfo(); }

        if (!this.id) { this.id = this.route.snapshot.paramMap.get('id'); }

        this.summary = [
            {
                property: 'AD Genetic Association',
                state: this.getText(this.geneInfo.isIGAP),
                hasLink: false,
                extraText: ''
            },
            {
                property: 'Brain eQTL',
                state: this.getText(this.geneInfo.haseqtl),
                hasLink: false,
                extraText: ''
            },
            {
                property: 'RNA Expression Change in AD Brain',
                state: this.getText(this.geneInfo.isChangedInADBrain),
                hasLink: false,
                extraText: ''
            },
            {
                property: 'Nominated Target',
                state: this.getText((this.geneInfo.nominations === undefined) ? false : true),
                hasLink: false,
                extraText: ''
            },
            {
                property: 'Gene Ontology',
                state: true,
                hasLink: true,
                extraText: 'View Gene Ontology',
                command: (event) => this.viewGeneOntology()
            },
            {
                property: 'Reactome Pathways',
                state: true,
                hasLink: true,
                extraText: 'View Reactome Pathways',
                command: (event) => this.viewPathways()
            },
            {
                property: 'Cell Type Specificity',
                state: false,
                hasLink: false,
                extraText: 'Coming Soon'
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

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets]) : this.router.navigate([path]);
    }
}
