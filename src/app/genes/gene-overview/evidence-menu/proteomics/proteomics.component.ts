import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { PlatformLocation } from '@angular/common';

import { Gene, GeneInfo } from '../../../../models';

import { emptyGene } from 'app/testing';

import { GeneService, ApiService } from '../../../../core/services';
import { ChartService } from 'app/charts/services';

import { SelectItem } from 'primeng/api';

@Component({
    selector: 'proteomics',
    templateUrl: './proteomics.component.html',
    styleUrls: [ './proteomics.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class ProteomicsComponent implements OnInit {
    @Input() gene: Gene = emptyGene;
    @Input() geneInfo: GeneInfo;
    @Input() id: string;

    dropdownIconClass: string = 'fa fa-caret-down';
    memberImages: any[] = [];
    emptySelection: SelectItem[] = [];
    selectedProteins: string[] = [];
    emptySelectionLabel: string = '- - -';
    emptySelectionValue: string = '';
    dataLoaded: boolean = false;
    isEmptyGene: boolean = true;

    constructor(
        private geneService: GeneService,
        private chartService: ChartService,
        private apiService: ApiService,
        private location: PlatformLocation
    ) {}

    ngOnInit() {
        this.gene = this.geneService.getCurrentGene();
        this.geneInfo = this.geneService.getCurrentInfo();
        if (this.gene && this.geneService.getGeneProteomics() && this.geneService.getGeneProteomics().length > 0) {
            this.isEmptyGene = false;
        }
        this.emptySelection.push({
            label: this.emptySelectionLabel,
            value: this.emptySelectionValue
        });

        this.location.onPopState(() => {
            this.isEmptyGene = true;
        });

        // Registers all the charts and loads data
        this.initData();
    }

    initData() {
        this.registerCharts().then((status) => {
            // First load of dimension and groups
            this.chartService.pQueryFilter.spGroup = '';
            this.apiService.refreshChartsData(
                this.chartService.pQueryFilter.spGroup,
                this.gene.ensembl_gene_id
            ).subscribe((d) => {
                this.chartService.filteredData = d;
                this.dataLoaded = true;
            });
        });
    }

    getDownloadFileName(suffix: string): string {
        return (this.gene.hgnc_symbol || this.gene.ensembl_gene_id) +
            '_' + suffix + '_' + this.geneService.getCurrentProtein();
    }

    registerCharts(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.chartService.addChartInfo(
                'select-protein',
                {
                    dimension: ['uniprotid'],
                    group: 'self',
                    type: 'select-menu',
                    title: '',
                    filter: 'default'
                },
                'Proteomics'
            );
            this.registerBoxPlot(
                'pbox-plot',
                [
                    {
                        name: 'AntPFC',
                        attr: 'tissue'
                    }
                ],
                'LOG 2 FOLD CHANGE',
                'log2_fc'
            );

            resolve(true);
        });
    }

    registerBoxPlot(
        label: string, constraints: any[], yAxisLabel: string, attr: string, type: string = 'Proteomics'
    ) {
        this.chartService.addChartInfo(
            label,
            {
                dimension: ['tissue', 'model'],
                group: 'self',
                type: 'box-plot',
                title: '',
                filter: 'default',
                xAxisLabel: '',
                yAxisLabel,
                format: 'array',
                attr,
                constraints
            },
            type
        );
    }

    getDropdownIcon(): string {
        return this.dropdownIconClass;
    }
}
