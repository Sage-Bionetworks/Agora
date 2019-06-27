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
        this.emptySelection.push({
            label: this.emptySelectionLabel,
            value: this.emptySelectionValue
        });

        this.location.onPopState(() => {
            this.isEmptyGene = true;
        });

        this.loadChartData().then((status) => {
            // First load of dimension and groups, set a default model so we don't
            // load all the data
            this.chartService.pQueryFilter.spGroup = '';
            this.apiService.refreshChart(
                this.chartService.queryFilter.spGroup,
                this.gene.hgnc_symbol,
                'Proteomics'
            ).subscribe((d) => {
                this.chartService.filteredData = d;
                // Check if we have any log2fc value
                if (!d.bpGroup || !d.bpGroup.top || !d.bpGroup.top.length) {
                    this.isEmptyGene = true;
                } else {
                    this.isEmptyGene = false;
                }
                this.dataLoaded = true;
            });
        });
    }

    loadChartData(): Promise<any> {
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
                'log2_fc',
                'Proteomics'
            );

            resolve(true);
        });
    }

    registerBoxPlot(
        label: string, constraints: any[], yAxisLabel: string, attr: string, type: string = 'RNA'
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
