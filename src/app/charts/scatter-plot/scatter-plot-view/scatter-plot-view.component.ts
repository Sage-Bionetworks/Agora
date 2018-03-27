import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input, ContentChild, AfterContentInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import {
    ActivatedRoute
} from '@angular/router';

import { Gene } from '../../../models';

import { ChartService } from '../../services';
import { DataService, GeneService } from '../../../core/services';

import * as d3 from 'd3';
import * as dc from 'dc';
import '../../../../scripts/dc-canvas-scatterplot.js';

import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'scatter-plot',
    templateUrl: './scatter-plot-view.component.html',
    styleUrls: [ './scatter-plot-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class ScatterPlotViewComponent implements OnInit, AfterContentInit {
    @Input() title: string;
    @Input() chart: any;
    @Input() info: any;
    @Input() label: string;
    @Input() currentGene = this.geneService.getCurrentGene();
    @Input() filterTissues = this.geneService.getTissues();
    @Input() filterModels = this.geneService.getModels();
    @Input() dim: any;
    @Input() group: any;

    @ViewChild('chart') scatterPlot: ElementRef;

    constructor(
        private route: ActivatedRoute,
        private chartService: ChartService,
        private dataService: DataService,
        private geneService: GeneService,
        private decimalPipe: DecimalPipe
    ) { }

    ngOnInit() {}

    ngAfterContentInit() {
        if (!this.label) {
            this.route.params.subscribe(params => {
                this.label = params['label'];
                this.initChart();
            });
        } else {
            this.initChart();
        }
    }

    initChart() {
        let self = this;
        this.info = this.chartService.getChartInfo(this.label);
        this.dim = this.dataService.getDimension(this.label, this.info, this.currentGene, this.filterTissues, this.filterModels);
        this.group = this.dataService.getGroup(this.label, this.info);
        this.title = this.info.title;

        //console.log(this.dataService.maxNegLogAdjPVal);
        // Create a symbol scale based on d3 types, then make the accessor
        // return two different types
        /*let symbolScale = d3.scale.ordinal().range(d3.svg.symbolTypes);
        let symbolAccessor = <any>function(d) {
            return symbolScale(
                (d.key[2] === currentGene.hgnc_symbol) ? '1' : '0'
            )
        };*/

        this.chart = dc.scatterPlot(this.scatterPlot.nativeElement);
        this.chart
            .useCanvas(true)
            .x(d3.scale.linear().domain(this.getDomain('logFC')))
            .y(d3.scale.linear().domain(this.getDomain('neg_log10_adj_P_Val', true)))
            .xAxisLabel(this.info.xAxisLabel)
            .yAxisLabel(this.info.yAxisLabel)
            .title(function(p) {
                return null;
            }) // disable tooltips
            .renderTitle(false)
            .brushOn(false)
            .mouseZoomable(true)
            .zoomOutRestrict(false)
            //.transitionDuration(0)
            .dimension(this.dim)
            .group(this.group)
            .keyAccessor((d) => {
                return d.key[0];
            })
            .valueAccessor((d) => {
                return d.key[1];
            })
            .colors(d3.scale.ordinal().domain(['yes', 'no']).range(['red', 'black']))
            .colorAccessor(function (d) {
                if (d.key[2] === self.currentGene.hgnc_symbol) {
                    return 'yes';
                } else {
                    return 'no';
                }
            })
            .on('preRender', (chart) => {
                /*chart
                    .x(d3.scale.linear().domain(this.getDomain('logFC')))
                    .y(d3.scale.linear().domain(self.getDomain('neg_log10_adj_P_Val', true)));*/

                chart.rescale();
            })
            .on('preRedraw', (chart) => {
                /*chart
                    .x(d3.scale.linear().domain(this.getDomain('logFC')))
                    .y(d3.scale.linear().domain(self.getDomain('neg_log10_adj_P_Val', true)));*/

                chart.rescale();
            });
            //.elasticY(true);
            //.symbol(symbolAccessor)
            //.symbolSize(7)
            //.highlightedSize(15)
            /*.renderTitle(true)
            .title(function (p) {
                return [
                    'Log Fold Change: ' + self.decimalPipe.transform(+p.key[0]),
                    '-log10(Adjusted p-value): ' + self.decimalPipe.transform(+p.key[1])
                ].join('\n');
            })*/

        // Separate this call so we can get the correct chart reference below
        //this.chart.yAxis().tickFormat(function(d) { return d3.format('.2f')(d); });

        this.chart.render();
    }

    getDomain(attr: string, altMin?: boolean): number[] {
        let self = this;
        let min = (self.dim.bottom(1)[0] && !altMin) ? +self.dim.bottom(1)[0][attr] : 0;
        let max = (self.dim.top(1)[0]) ? +self.dim.top(1)[0][attr] : 0;
        let margin = (max - min) * 0.05;
        min -= margin;
        max += margin;

        return [min, max];
    }
}
