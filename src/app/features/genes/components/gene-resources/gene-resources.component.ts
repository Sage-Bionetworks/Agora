import { Component, Input } from '@angular/core';

import { Gene } from '../../../../models';

interface AdditionalResource {
  title: string;
  description: string;
  linkText: string;
  link: string;
}

@Component({
  selector: 'gene-resources',
  templateUrl: './gene-resources.component.html',
  styleUrls: ['./gene-resources.component.scss'],
})
export class GeneResourcesComponent {
  _gene: Gene = {} as Gene;
  get gene(): Gene {
    return this._gene;
  }
  @Input() set gene(gene: Gene) {
    this._gene = gene;
    this.setAdditionalResources();
  }
  additionalResources: AdditionalResource[] = [] as AdditionalResource[];

  setAdditionalResources() {
    this.additionalResources = [
      {
        title: 'Open Targets',
        description:
          'View this gene on Open Targets, a resource that provides evidence on the validity of therapeutic targets based on genome-scale experiments and analysis.',
        linkText: 'Visit Open Targets',
        link: `https://platform.opentargets.org/target/${this.gene.ensembl_gene_id}`,
      },
      {
        title: 'Pharos',
        description:
          'View this gene on Pharos, a resource that provides access to the integrated knowledge-base from the Illuminating the Druggable Genome program.',
        linkText: 'Visit Pharos',
        link: `https://pharos.nih.gov/targets?q=${this.gene.ensembl_gene_id}`,
      },
      {
        title: 'Brain RNAseq',
        description:
          'Search for this gene on the Brain RNAseq site, which hosts single-cell RNAseq data.',
        linkText: 'Visit BrainRNAseq',
        link: 'http://www.brainrnaseq.org/',
      },
      {
        title: 'Genomics DB',
        description:
          'View this gene on the National Institute on Aging Alzheimer&quot;s Genetics of Alzheimer&quot;s Disease Data Storage Site (NIAGADS) Genomics Database.',
        linkText: 'Visit Genomics DB',
        link: `https://www.niagads.org/genomics/showRecord.do?name=GeneRecordClasses.GeneRecordClass&source_id=${this.gene.ensembl_gene_id}`,
      },
      {
        title: 'AD Atlas',
        description:
          'View this gene on the AD Atlas site, a network-based resource for investigating AD in a multi-omics context.',
        linkText: 'Visit AD Atlas',
        link: `https://adatlas.org/?geneID=${this.gene.ensembl_gene_id}`,
      },
      {
        title: 'Pub AD',
        description:
          'View dementia-related publication information for this gene on PubAD.',
        linkText: 'Visit PubAD',
        link: `https://adexplorer.medicine.iu.edu/pubad/external/${this.gene.ensembl_gene_id}`,
      },
      {
        title: 'Gene Ontology',
        description:
          'View the gene ontology information for this gene on Ensembl.',
        linkText: 'Visit Ensembl',
        link: `https://www.ensembl.org/Homo_sapiens/Gene/Ontologies/molecular_function?g=${this.gene.ensembl_gene_id}`,
      },
      {
        title: 'Reactome Pathways',
        description:
          'View the reactome pathway information for this gene on Ensembl.',
        linkText: 'Visit Ensembl',
        link: `https://www.ensembl.org/Homo_sapiens/Gene/Pathway?g=${this.gene.ensembl_gene_id}`,
      },
    ];
  }
}
