import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { Gene } from '../../../../models';
import { GeneService } from '../../services';
import { HelperService } from '../../../../core/services';

interface Panel {
  name: string;
  label: string;
  disabled: boolean;
}

@Component({
  selector: 'gene-details',
  templateUrl: './gene-details.component.html',
  styleUrls: ['./gene-details.component.scss'],
})
export class GeneDetailsComponent implements OnInit, AfterViewInit {
  gene: Gene = {} as Gene;

  panels: Panel[] = [
    {
      name: 'summary',
      label: 'Summary',
      disabled: false,
    },
    {
      name: 'evidence',
      label: 'Evidence',
      disabled: false,
    },
    {
      name: 'resources',
      label: 'Resources',
      disabled: false,
    },
    {
      name: 'nominations',
      label: 'Nominations details',
      disabled: false,
    },
    {
      name: 'experimental-validation',
      label: 'Experimental Validation',
      disabled: false,
    },
  ];

  activePanel = 'summary';
  isNavigationOpen = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private helperService: HelperService,
    private geneService: GeneService
  ) {}

  ngOnInit() {
    this.helperService.setLoading(true);
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.get('id')) {
        this.geneService
          .getGene(params.get('id') as string)
          .subscribe((gene: Gene) => {
            this.helperService.setLoading(false);
            this.gene = gene;

            // TODO: remove
            // console.log('Gene loaded:', gene);

            if (!this.gene.nominations) {
              const panel: Panel =
                this.panels.find((p) => p.name == 'nominations') ||
                ({} as Panel);
              panel.disabled = true;
            }

            if (!this.gene.experimental_validation?.length) {
              const panel: Panel =
                this.panels.find((p) => p.name == 'experimental-validation') ||
                ({} as Panel);
              panel.disabled = true;
            }
          });
      }

      if (params.get('tab')) {
        this.activePanel = params.get('tab') as string;
      }
    });
  }

  ngAfterViewInit() {
    if (!this.gene.ensembl_gene_id) {
      this.helperService.setLoading(true);
    }
  }

  activatePanel(panel: Panel) {
    if (panel.disabled) {
      return;
    }
    this.activePanel = panel.name;
    this.location.replaceState(
      '/genes/' + this.gene.ensembl_gene_id + '/' + panel.name
    );
  }

  onNavigationClick(panel: Panel) {
    this.activatePanel(panel);
    this.isNavigationOpen = !this.isNavigationOpen;
  }
}
