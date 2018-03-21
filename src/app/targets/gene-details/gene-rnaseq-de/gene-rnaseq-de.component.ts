import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Gene } from '../../../models';

import {
    ChartService,
    GeneService
} from '../../../core/services';

import { Observable } from 'rxjs/Observable';

import * as d3 from 'd3';
import * as dc from 'dc';

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

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private geneService: GeneService,
        private chartService: ChartService
    ) { }

    ngOnInit() {
        this.loadChartData();

        this.router.navigate([
            '/targets/gene-details/'+this.id,
            { outlets: { 'left-chart': [ 'left-scatter-plot', 'volcano-plot' ] }}
        ], {skipLocationChange: true}).then(data => {
            this.router.navigate([
                '/targets/gene-details/'+this.id,
                { outlets: { 'right-chart': [ 'right-row-chart', 'forest-plot' ] }}
            ], {skipLocationChange: true});
        });

    }

    loadChartData() {
        this.chartService.setData(this.geneService.getGenes());
        this.chartService.addChartInfo(
            'volcano-plot',
            {
                dimension: ['logFC', 'neg_log10_adj_P_Val', 'hgnc_symbol'],
                group: 'self',
                type: 'scatter-plot',
                title: 'Volcano Plot',
                xAxisLabel: 'Log Fold Change',
                yAxisLabel: '-log10(Adjusted p-value)',
                x: ['logFC'],
                y: ['neg_log10_adj_P_Val']
            }
        );
        this.chartService.addChartInfo(
            'forest-plot',
            {
                dimension: ['tissue_study_pretty'],
                group: 'self',
                type: 'forest-plot',
                title: 'Log fold forest plot',
                x: ['ci_L', 'ci_R'],
                filter: true,
                attr: 'logFC'
            }
        );
        this.chartService.addChartInfo(
            'select-tissue',
            {
                dimension: ['tissue_study_pretty'],
                group: 'self',
                type: 'select-menu'
            }
        );
        this.chartService.addChartInfo(
            'select-model',
            {
                dimension: ['comparison_model_sex'],
                group: 'self',
                type: 'select-menu'
            }
        );
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets], {relativeTo: this.route}) : this.router.navigate([path], {relativeTo: this.route});
    }
}
