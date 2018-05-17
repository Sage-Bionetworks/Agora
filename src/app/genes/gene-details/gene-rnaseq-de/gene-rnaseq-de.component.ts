import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Gene } from '../../../models';

import { ChartService } from '../../../charts/services';
import { GeneService } from '../../../core/services';

import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'gene-rnaseq-de',
    templateUrl: './gene-rnaseq-de.component.html',
    styleUrls: [ './gene-rnaseq-de.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneRNASeqDEComponent implements OnInit {
    @Input() styleClass: string = 'rnaseq-panel';
    @Input() style: any;
    @Input() gene: Gene;
    @Input() id: string;
    dataLoaded: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private geneService: GeneService,
        private chartService: ChartService
    ) { }

    ngOnInit() {
        this.loadChartData().then((status) => {
            this.dataLoaded = status;
        });
    }

    loadChartData(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.chartService.addChartInfo(
                'volcano-plot',
                {
                    dimension: ['logfc', 'neg_log10_adj_p_val', 'hgnc_symbol'],
                    group: 'self',
                    type: 'scatter-plot',
                    title: 'Volcano Plot',
                    xAxisLabel: 'Log Fold Change',
                    yAxisLabel: '-log10(Adjusted p-value)',
                    x: ['logfc'],
                    y: ['neg_log10_adj_p_val']
                }
            );
            this.chartService.addChartInfo(
                'box-plot',
                {
                    dimension: ['logfc', 'hgnc_symbol'],
                    group: 'self',
                    type: 'box-plot',
                    title: '',
                    filter: 'default',
                    xAxisLabel: '',
                    yAxisLabel: 'log2(fold change)',
                    format: 'array',
                    attr: 'logfc'
                }
            );
            this.chartService.addChartInfo(
                'box-plot2',
                {
                    dimension: ['neg_log10_adj_p_val', 'hgnc_symbol'],
                    group: 'self',
                    type: 'box-plot',
                    title: '',
                    filter: 'default',
                    xAxisLabel: '',
                    yAxisLabel: 'log10(adj p val)',
                    format: 'array',
                    attr: 'neg_log10_adj_p_val'
                }
            );
            this.chartService.addChartInfo(
                'forest-plot',
                {
                    dimension: ['tissue_study_pretty'],
                    group: 'self',
                    type: 'forest-plot',
                    title: 'Log fold forest plot',
                    filter: 'default',
                    attr: 'logfc'
                }
            );
            this.chartService.addChartInfo(
                'select-tissue',
                {
                    dimension: ['tissue_study_pretty'],
                    group: 'self',
                    type: 'select-menu',
                    title: '',
                    filter: 'default'
                }
            );
            this.chartService.addChartInfo(
                'select-model',
                {
                    dimension: ['comparison_model_sex_pretty'],
                    group: 'self',
                    type: 'select-menu',
                    title: '',
                    filter: 'default'
                }
            );

            resolve(true);
        });
    }

    getTissue(index: number) {
        return this.geneService.getTissues()[index];
    }

    getModel(index: number) {
        return this.geneService.getModels()[index];
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets], {relativeTo: this.route}) :
        this.router.navigate([path], {relativeTo: this.route});
    }
}
