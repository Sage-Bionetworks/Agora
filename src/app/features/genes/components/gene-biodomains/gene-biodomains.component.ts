import { Component, Input, OnInit } from '@angular/core';
import { BioDomain, Gene } from 'app/models';

@Component({
  selector: 'gene-biodomains',
  templateUrl: './gene-biodomains.component.html',
  styleUrls: ['./gene-biodomains.component.scss'],
})
export class GeneBioDomainsComponent implements OnInit {
  @Input() gene: Gene | undefined;

  getGeneName() {
    if (this.gene)
      return this.gene.hgnc_symbol || this.gene.ensembl_gene_id;
    return '';
  }

  selectedBioDomain: BioDomain | undefined;
  goTerms: string[] = [];

  defaultBioDomains = [
    'Apoptosis',
    'APP Metabolism',
    'Autophagy',
    'Cell Cycle',
    'DNA Repair',
    'Endolysosome',
    'Epigenetic',
    'Immune Response',
    'Lipid Metabolism',
    'Metal Binding and Homeostasis',
    'Mitochondrial Metabolism',
    'Myelination',
    'Oxidative Stress',
    'Proteostasis',
    'RNA Spliceosome',
    'Structural Stabilization', 
    'Synapse',
    'Tau Homeostasis',
    'Vasculature',
  ];

  getGoTerms(index: number): string[] {
    if (this.gene && this.gene.bio_domains) {
      const biodomain = this.gene.bio_domains.gene_biodomains[index];
      const sorted = biodomain.go_terms.sort((a, b) => {
        // sort by GO terms ascending
        return a.localeCompare(b);
      });
      return sorted;
    }
    return [];
  }

  onSelectedBioDomain(index: number) {
    console.log('in onselectedbiodomain' + index);
    this.goTerms = this.getGoTerms(index);
    this.selectedBioDomain = this.gene?.bio_domains?.gene_biodomains[index];
  }

  ngOnInit(): void {
    this.processBioDomains();
  }
  
  processBioDomains() {
    // add missing biodomains
    this.defaultBioDomains.forEach((d) => {
      const exists = this.gene?.bio_domains?.gene_biodomains.find((b) => b.biodomain === d);
      if (!exists) {
        this.gene?.bio_domains?.gene_biodomains.push({
          biodomain: d,
          go_terms: [],
          n_biodomain_terms: 0,
          n_gene_biodomain_terms: 0,
          pct_linking_terms: 0
        });
      }
    });

    // sort existing biodomains
    this.gene?.bio_domains?.gene_biodomains
      .sort((a, b) => {
        // sort by pct_linking_terms descending first
        if (a.pct_linking_terms !== b.pct_linking_terms) {
          return b.pct_linking_terms - a.pct_linking_terms;
        }
        // otherwise sort by biodomains ascending
        return a.biodomain.localeCompare(b.biodomain);
      });
  }

  getHeaderText() {
    if (this.goTerms.length === 0)
      return 'NO LINKING GO TERMS';
    return `LINKING GO TERMS FOR ${ this.selectedBioDomain?.biodomain.toUpperCase() } (${ this.selectedBioDomain?.n_gene_biodomain_terms}/${ this.selectedBioDomain?.n_biodomain_terms})`;
  }

  capitalizeGoTerm(goTerm: string) {
    return goTerm[0].toUpperCase() + goTerm.slice(1);
  }
}
