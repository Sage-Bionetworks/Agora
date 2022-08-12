import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { GeneService } from '../../services';
import { ApiService } from '../../../../core/services';
import { HelperService } from '../../../../core/services';

import { Gene, GenesResponse } from '../../../../models';

interface TableColumn {
  field: string;
  header: string;
  selected?: boolean;
}

@Component({
  selector: 'gene-similar',
  templateUrl: './gene-similar.component.html',
  styleUrls: ['./gene-similar.component.scss'],
})
export class GeneSimilarComponent implements OnInit {
  gene: Gene = {} as Gene;
  genes: Gene[] = [];

  tableColumns: TableColumn[] = [
    { field: 'hgnc_symbol', header: 'Gene name', selected: true },
    {
      field: 'nominated_target_display_value',
      header: 'Nominated Target',
      selected: true,
    },
    {
      field: 'isIGAP',
      header: 'Genetic Association with LOAD',
      selected: true,
    },
    { field: 'haseqtl', header: 'Brain eQTL', selected: true },
    {
      field: 'is_any_rna_changed_in_ad_brain_display_value',
      header: 'RNA Expression Change',
      selected: true,
    },
    {
      field: 'is_any_protein_changed_in_ad_brain_display_value',
      header: 'Protein Expression Change',
    },
    { field: 'pharos_class_display_value', header: 'Pharos Class' },
    {
      field: 'sm_druggability_display_value',
      header: 'Small Molecule Druggability',
    },
    { field: 'safety_rating_display_value', header: 'Safety Rating' },
    { field: 'ab_modality_display_value', header: 'Antibody Modality' },
  ];

  gctLink: { [key: string]: string } | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private helperService: HelperService,
    private geneService: GeneService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.get('id')) {
        this.helperService.setLoading(true);
        this.geneService
          .getGene(params.get('id') as string)
          .subscribe((gene: Gene) => {
            this.gene = gene;
            this.init();
          });
      }
    });
  }

  init() {
    if (!this.gene?.similar_genes_network?.nodes?.length) {
      return;
    }

    const ids: any = [];
    this.gene.similar_genes_network.nodes.forEach((obj: any) => {
      ids.push(obj.ensembl_gene_id);
    });

    this.apiService.getGenes(ids).subscribe((response: GenesResponse) => {
      const genes = response.items;

      genes.forEach((de: Gene) => {
        // Populate display fields & set default values
        de.is_any_rna_changed_in_ad_brain_display_value =
          de.rna_brain_change_studied
            ? de.isAnyRNAChangedInADBrain.toString()
            : 'No data';
        de.is_any_protein_changed_in_ad_brain_display_value =
          de.protein_brain_change_studied
            ? de.isAnyProteinChangedInADBrain.toString()
            : 'No data';
        de.nominated_target_display_value = de.nominations > 0;

        // Populate Druggability display fields
        if (de.druggability && de.druggability.length) {
          de.pharos_class_display_value = de.druggability[0].pharos_class
            ? de.druggability[0].pharos_class
            : 'No value';
          de.sm_druggability_display_value =
            de.druggability[0].sm_druggability_bucket +
            ': ' +
            de.druggability[0].classification;
          de.safety_rating_display_value =
            de.druggability[0].safety_bucket +
            ': ' +
            de.druggability[0].safety_bucket_definition;
          de.ab_modality_display_value =
            de.druggability[0].abability_bucket +
            ': ' +
            de.druggability[0].abability_bucket_definition;
        } else {
          de.pharos_class_display_value = 'No value';
          de.sm_druggability_display_value = 'No value';
          de.safety_rating_display_value = 'No value';
          de.ab_modality_display_value = 'No value';
        }
      });

      this.genes = genes;
    });

    this.helperService.setLoading(false);
  }

  navigateToGeneComparisonTool() {
    const ids: string[] = this.genes.map((g: Gene) => g.ensembl_gene_id);
    this.helperService.setGCTSection(ids);
    this.router.navigate(['/genes/comparison']);
  }
}
