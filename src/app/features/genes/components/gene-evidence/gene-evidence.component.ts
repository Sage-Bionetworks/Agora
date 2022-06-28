import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { Gene } from '../../../../models';

interface Panel {
  name: string;
  label: string;
  disabled: boolean;
}

@Component({
  selector: 'gene-evidence',
  templateUrl: './gene-evidence.component.html',
  styleUrls: ['./gene-evidence.component.scss'],
})
export class GeneEvidenceComponent implements OnInit {
  @Input() gene: Gene = {} as Gene;

  panels: Panel[] = [
    {
      name: 'rna',
      label: 'RNA',
      disabled: false,
    },
    {
      name: 'proteomics',
      label: 'Proteomics',
      disabled: false,
    },
    {
      name: 'metabolomics',
      label: 'Metabolomics',
      disabled: false,
    },
  ];

  activePanel = 'rna';

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.get('subtab')) {
        this.activePanel = params.get('subtab') as string;
      }
    });
  }

  activatePanel(panel: Panel) {
    if (panel.disabled) {
      return;
    }
    this.activePanel = panel.name;
    this.location.replaceState(
      '/genes/' + this.gene.ensembl_gene_id + '/evidence/' + panel.name
    );
  }
}
