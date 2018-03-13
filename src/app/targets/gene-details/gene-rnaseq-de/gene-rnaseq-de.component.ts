import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Gene } from '../../../models';

import { GeneService } from '../../services';
import { ChartService } from '../../../core/services';

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
    @Input() tissues$: Observable<string[]>;
    @Input() models$: Observable<string[]>;
    @Input() id: string;
    @Input() data: Gene[];

    @ViewChild('st') selectTissue: ElementRef;
    @ViewChild('sm') selectModel: ElementRef;

    private sub: any;

    selectedTissue: string;
    selectedModel: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private geneService: GeneService,
        private chartService: ChartService
    ) { }

    ngOnInit() {
        if (!this.gene) this.router.navigate(['/targets']);
        this.tissues$ = this.geneService.getTissues('tissues.json');
        this.models$ = this.geneService.getTissues('models.json');

        this.selectedTissue = this.gene.tissue_study_pretty;
        this.selectedModel = this.gene.model_sex_pretty;

        this.loadChartData();

        this.router.navigate([
            '/targets/gene-details/'+this.id,
            { outlets: { 'left-chart': [ 'left-scatter-plot', 'volcano-plot' ] }}
        ], {skipLocationChange: true}).then(data => {
            this.router.navigate([
                '/targets/gene-details/'+this.id,
                //{ outlets: { 'right-chart': [ 'right-scatter-plot', 'forest-plot' ] }}
                { outlets: { 'right-chart': [ 'right-row-chart', 'forest-plot' ] }}
            ], {skipLocationChange: true});
        });

    }

    loadChartData() {
        // Begin getting chart data
        if (!this.data) this.data = this.geneService.getGenesArray();

        this.chartService.setData(this.data);
        this.chartService.addChartInfo(
            'volcano-plot',
            {
                dimension: function(d) { return [
                    Number.isNaN(+d.logFC) ? 0 : d.logFC,
                    Number.isNaN(+d.neg_log10_adj_P_Val) ? 0 : d.neg_log10_adj_P_Val
                ] },
                group: 'self',
                type: 'scatter-plot',
                title: 'Volcano Plot',
                xAxisLabel: 'Log Fold Change',
                yAxisLabel: '-log10(Adjusted p-value',
                x: d3.scale.linear().domain([-2,2.5]),
                y: d3.scale.linear().domain([0,20])
            }
        );
        this.chartService.addChartInfo(
            'forest-plot',
            {
                dimension: function(v) {
                    return v.tissue_study_pretty;
                },
                group: 'self-avg',
                type: 'row-chart',
                title: 'Log fold forest plot',
                x: d3.scale.linear().domain([-0.5,0.5])
            }
        );
        this.chartService.addChartInfo(
            'select-tissue',
            {
                dimension: function(d) { return d.tissue_study_pretty },
                group: 'self',
                type: 'select-menu'
            }
        );
        this.chartService.addChartInfo(
            'select-model',
            {
                dimension: function(d) { return d.model_sex_pretty },
                group: 'self',
                type: 'select-menu'
            }
        );
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets], {relativeTo: this.route}) : this.router.navigate([path], {relativeTo: this.route});
    }
}
