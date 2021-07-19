import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Gene, GeneInfo } from '../../../models';

import { GeneService } from '../../../core/services';

import * as d3 from 'd3';


export type GeneResourceType = {
    title: string,
    description: string,
    linkText: string,
    link: string
}

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
    bucketsSM: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    bucketsAB: number[] = [1, 2, 3, 4, 5, 6, 7];
    bucketsSF: number[] = [1, 2, 3, 4, 5, 6];
    currentBucketSM: number = 1;
    currentBucketAB: number = 1;
    currentBucketSF: number = 1;
    classes: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];
    additionalResources: GeneResourceType[] = []

    constructor(
        private route: ActivatedRoute,
        private geneService: GeneService
    ) {}

    ngOnInit() {
        if (!this.gene) { this.gene = this.geneService.getCurrentGene(); }
        if (!this.geneInfo) { this.geneInfo = this.geneService.getCurrentInfo(); }

        if (!this.id) { this.id = this.route.snapshot.paramMap.get('id'); }

        // Update the initial buckets
        if (this.geneInfo) {
            this.currentBucketSM = this.geneInfo.druggability[0].sm_druggability_bucket;
            this.currentBucketAB = this.geneInfo.druggability[0].abability_bucket;
            this.currentBucketSF = this.geneInfo.druggability[0].safety_bucket;
        }
        this.setAdditionalResources()
    }

    getDruggabilitySMTitle(bucket: number): string {
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
                return 'Potentially targetable by protein family structure';
            case 8:
                return 'Endogenous ligand';
            case 9:
                return 'Potentially small molecule druggable by family (active ligand)';
            case 10:
                return 'Potentially small molecule druggable by family (low activity ligand)';
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

    getDruggabilityABTitle(bucket: number): string {
        switch (bucket) {
            case 1:
                return 'Ideal';
            case 2:
                return 'Highly accessible';
            case 3:
                return 'Accessible';
            case 4:
                return 'Probably accessible';
            case 5:
                return 'Probably inaccessible';
            case 6:
                return 'Inaccessible';
            case 7:
                return 'Unknown';
            default:
                return '';
        }
    }

    getDruggabilitySFTitle(bucket: number): string {
        switch (bucket) {
            case 1:
                return 'Lowest risk';
            case 2:
                return 'Lower risk';
            case 3:
                return 'Potential risks';
            case 4:
                return 'Probable risks';
            case 5:
                return 'Potentially unsafe in humans';
            case 6:
                return 'Unknown';
            default:
                return '';
        }
    }

    getDruggabilitySMText(bucket: number): string {
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
                return 'Is a member of a gene family which has a protein member with a druggable pocket ' +
                'in the protein structure.';
            case 8:
                return 'Has an identified endogenous ligand according from IUPHAR.';

            case 9:
                return 'Is a member of a gene family which has a member with an small molecule ligand identified from ChEMBL data, meeting TCRD activity criteria.';
            case 10:
                return 'Is a member of a gene family which has a protein member with a ligand which does not meet TCRD activity criteria.';
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

    getDruggabilityABText(bucket: number): string {
        switch (bucket) {
            case 1:
                return 'Secreted protein. Highly accessible to antibody-based therapies';
            case 2:
                return 'Component of the extracellular matrix (ECM). Highly accessible to ' +
                'antibody-based therapies, but potentially less so than secreted proteins';
            case 3:
                return 'Cell membrane-bound proteins. Highly accessible to antibody-based ' +
                'therapies, but potentially less so than secreted proteins or ECM components';
            case 4:
                return 'Limited evidence that target is a secreted protein, ECM component or ' +
                'cell membrane-bound protein';
            case 5:
                return 'Protein located in the cytosol. Not practically accessible to ' +
                'antibody-based therapies, but may be more easily accessible to other modalities';
            case 6:
                return 'Protein located in intracellular compartment';
            case 7:
                return 'Dark target. Paucity of biological knowledge means progress will be ' +
                'difficult';
            default:
                return '';
        }
    }

    getDruggabilitySFText(bucket: number): string {
        switch (bucket) {

            case 1:
                return 'Clinical data, evidence of tolerable safety profile in desired modality; ' +
                'target has a drug in phase IV in the appropriate modality, with good safety profile.';
            case 2:
                return 'No major issues found from gene expression, genetic or pharmacological ' +
                'profiling, but has not been extensively tested in humans.';
            case 3:
                return 'Two or fewer of: high off-target gene expression, cancer driver, ' +
                'essential gene, associated deleterious genetic disorder, HPO phenotype ' +
                'associated gene, or black box warning on clinically used drug.';

            case 4:
                return 'More than two of: high off target gene expression, cancer driver, ' +
                'essential gene, associated deleterious genetic disorder, HPO phenotype ' +
                'associated gene, or black box warning on clinically used drug.';
            case 5:
                return 'Clinical data with evidence of intolerable safety profile/adverse drug reactions ' +
                'in the desired modality and with target engagement. Drug for target withdrawn on those grounds.';
            case 6:
                return 'Insufficient data available for safety assessment.';
            default:
                return '';
        }
    }

    getBucketTextColor(bucket: number, section: string): string {
        let range: number;

        if (section === 'sm') {
            range = 13;
        } else if (section === 'ab') {
            range = 7;
        } else if (section === 'sf') {
            range = 6;
        }

        return (bucket < range) ? '#FFFFFF' : '#000000';
    }

    getIconStyle(bucket: number, section: string): string {
        return '16px solid ' + this.getBucketBGColor(bucket, section);
    }

    getBucketBGColor(bucket: number, section: string): string {
        const i = d3.interpolateRgb('#20A386', '#440D54');
        let range: number;

        if (section === 'sm') {
            range = 12;
        } else if (section === 'ab') {
            range = 6;
        } else if (section === 'sf') {
            range = 5;
        }

        if (bucket <= range && bucket > 0) {
            return d3.hcl(i(bucket / range)).hex();
        } else if (bucket === range + 1) {
            return '#C3C7D1';
        } else if (bucket === range + 2) {
            return '#AFDDDF';
        }

        return '#FFFFFF';
    }

    getBucketIconStyle(isSelection: boolean): object {
        const widthString = (isSelection) ? '62px' : '36px';
        const marginStringString = (isSelection) ? '9.5px' : '22.5px';
        const iconClass: object = {
            'display': 'inline-block',
            'border-radius': '50%',
            'width': widthString,
            'margin-left': marginStringString,
            'margin-right': marginStringString,
            'cursor': 'pointer'
        };

        return iconClass;
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

    getClassTextMargin(isSelection: boolean): string {
        return (isSelection) ? '6px' : '12px';
    }

    setCurrentBucket(bucket: number, section: string) {
        if (section === 'sm') {
            this.currentBucketSM = bucket;
        } else if (section === 'ab') {
            this.currentBucketAB = bucket;
        } else if (section === 'sf') {
            this.currentBucketSF = bucket;
        }
    }

    resetBucket(event: any) {
        if (this.geneInfo && event.index !== undefined) {
            if (event.index === 0) {
                this.currentBucketSM = this.geneInfo.druggability[0].sm_druggability_bucket;
            } else if (event.index === 1) {
                this.currentBucketAB = this.geneInfo.druggability[0].abability_bucket;
            } else if (event.index === 2) {
                this.currentBucketSF = this.geneInfo.druggability[0].safety_bucket;
            }
        }
    }

    setAdditionalResources() {
        this.additionalResources = [
            {
                title: 'Open Targets',
                description: 'View this gene on Open Targets, a resource that provides evidence on the validity of therapeutic targets based on genome-scale experiments and analysis.',
                linkText: 'Visit Open Targets',
                link: `https://platform.opentargets.org/target/${this.gene.ensembl_gene_id}`
            },
            {
                title: 'Pharos',
                description: `View this gene on Pharos, a resource that provides access to the integrated knowledge-base from the Illuminating the Druggable Genome program.`,
                linkText: 'Visit Pharos',
                link: `https://pharos.nih.gov/search?q=%22${this.gene.hgnc_symbol}%22`
            },
            {
                title: 'Brain RNAseq',
                description: 'Search for this gene on the Brain RNAseq site, which hosts single-cell RNAseq data.',
                linkText: 'Visit BrainRNAseq',
                link: `http://www.brainrnaseq.org/`
            },
            {
                title: 'Genomics DB',
                description: 'View this gene on the National Institute on Aging Alzheimer\'s Genetics of Alzheimer\'s Disease Data Storage Site (NIAGADS) Genomics Database.',
                linkText: 'Visit Genomics DB',
                link: `https://www.niagads.org/genomics/showRecord.do?name=GeneRecordClasses.GeneRecordClass&source_id=${this.gene.ensembl_gene_id}`
            },
            {
                title: 'AD Atlas',
                description: 'View this gene on the AD Atlas site, a network-based resource for investigating AD in a multi-omics context.',
                linkText: 'Visit AD Atlas',
                link: `https://adatlas.org/?geneID=${this.gene.ensembl_gene_id}`
            },
            {
                title: 'Gene Ontology',
                description: 'View the gene ontology information for this gene on Ensembl.',
                linkText: 'Visit Ensembl',
                link: `https://www.ensembl.org/Homo_sapiens/Gene/Ontologies/molecular_function?g=${this.gene.ensembl_gene_id}`
            },
            {
                title: 'Reactome Pathways',
                description:  'View the reactome pathway information for this gene on Ensembl.',
                linkText: 'Visit Ensembl',
                link: `https://www.ensembl.org/Homo_sapiens/Gene/Pathway?g=${this.gene.ensembl_gene_id}`
            }
        ]
    }
}
