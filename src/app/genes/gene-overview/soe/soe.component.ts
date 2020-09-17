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
                property: {
                    title: 'Genetic Association with LOAD',
                    description: 'Indicates whether or not this gene shows significant genetic association with Late Onset AD (LOAD) based on the',
                    link: 'https://doi.org/10.1038/s41588-019-0358-2',
                    anchorText: 'International Genomics of Alzheimer\'s Project (IGAP) genome-wide association study'
                },
                state: (this.geneInfo.isIGAP === undefined) ? false : this.geneInfo.isIGAP,
                hasLink: false,
                extraText: ''
            },
            {
                property: {
                    title: 'Brain eQTL',
                    description: 'Indicates whether or not this gene locus has a significant expression Quantitative Trait Locus (eQTL) based on an',
                    link: 'https://doi.org/10.1101/638544',
                    anchorText: 'AMP-AD consortium study'
                },
                state: (this.geneInfo.haseqtl === undefined) ? false : this.geneInfo.haseqtl,
                hasLink: false,
                extraText: ''
            },
            {
                property: {
                    title: 'RNA Expression Change in AD Brain',
                    description: 'Indicates whether or not this gene shows significant differential expression in at least one brain region based on AMP-AD consortium work.'},
                    state: (this.geneInfo.isChangedInADBrain === undefined) ?
                        false : this.geneInfo.isChangedInADBrain,
                    hasLink: false,
                    extraText: ''
            },
            {
                property: {
                    title: 'Nominated Target',
                    description: 'Indicates whether or not this gene has been submitted as a nominated target to Agora.'
                },
                state: (this.geneInfo.nominations === undefined) ?
                    false : this.geneInfo.nominations,
                hasLink: false,
                extraText: ''
            },
            {
                property: {
                    title: 'Gene Ontology',
                    description: 'Provides a link out to gene ontology information in Ensembl.'
                },
                state: true,
                hasLink: true,
                extraText: 'Visit Ensembl',
                command: (event) => this.openExternalLink(
                    `https://www.ensembl.org/Homo_sapiens/Gene/Ontologies/molecular_function?g=${this.gene.ensembl_gene_id}`
                )
            },
            {
                property: {
                    title: 'Reactome Pathways',
                    description:  'Provides a link out to reactome pathway information in Ensembl.'
                },
                state: true,
                hasLink: true,
                extraText: 'Visit Ensembl',
                command: (event) => this.openExternalLink(
                    `https://www.ensembl.org/Homo_sapiens/Gene/Pathway?g=${this.gene.ensembl_gene_id}`
                )
            },
            {
                property: {
                    title: 'Evidence for AD Association',
                    description: 'Provides a link out to the Open Targets site, which collates various forms of evidence for a gene\'s association to AD.'
                },
                state: true,
                hasLink: true,
                extraText: 'Visit Open Targets',
                command: (event) => this.openExternalLink(
                    `https://www.targetvalidation.org/evidence/${this.gene.ensembl_gene_id}/EFO_0000249`
                )
            },
            {
                property: {
                    title: 'Cell Type Specificity',
                    description: 'Provides a link out to the Brain RNAseq site, which hosts single-cell RNAseq data.'

                },
                state: true,
                hasLink: true,
                extraText: 'Visit Brain RNAseq',
                command: (event) => this.openExternalLink(
                    `http://www.brainrnaseq.org/`
                )
            },
            {
                property: {
                    title: 'Explore Genetic Evidence on NIAGADS',
                    description: 'Provides a link out to the National Institute on Aging Alzheimer\'s Genetics of Alzheimer\'s Disease Data Storage Site (NIAGADS) Genomics Database.'
                },
                state: true,
                hasLink: true,
                extraText: 'Visit Alzheimer\'s Genomics Database',
                command: (event) => this.openExternalLink(
                    `https://www.niagads.org/genomics/showRecord.do?name=GeneRecordClasses.GeneRecordClass&source_id=${this.gene.ensembl_gene_id}`
                )
            },
            {
                property: {
                    title: 'Explore the Alzheimer\'s Disease Atlas',
                    description: 'Provides a link out to the AD Atlas site, a network-based resource for investigating AD in a multi-omics context.'
                },
                state: true,
                hasLink: true,
                extraText: 'Visit the AD Atlas',
                command: (event) => this.openExternalLink(
                    `https://adatlas.org/?geneID=${this.gene.ensembl_gene_id}`
                )
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

    openExternalLink(url) {
        if (!url) {
            return;
        }
        window.open(url, '_blank');
    }

}
