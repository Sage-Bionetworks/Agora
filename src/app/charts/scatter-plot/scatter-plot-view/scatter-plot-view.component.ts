import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input, ContentChild, AfterContentInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import {
    ActivatedRoute
} from '@angular/router';

import { Gene } from '../../../models';

import {
    ChartService
} from '../../../core/services';

import { GeneService } from '../../../core/services';

import * as d3 from 'd3';
import * as dc from 'dc';
import '../../../../scripts/dc-canvas-scatterplot.js';

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

    @ViewChild('chart') scatterPlot: ElementRef;
    subChart: any;
    svgAdded: boolean = false;

    private dim: CrossFilter.Dimension<any, any>;
    private group: CrossFilter.Group<any, any, any>;

    constructor(
        private route: ActivatedRoute,
        private chartService: ChartService,
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
        this.info = this.chartService.getChartInfo(this.label)
        this.title = this.info.title;

        // Init the chart variables
        this.dim = this.chartService.getDimension(this.label);
        this.group = this.chartService.getGroup(this.label);

        let currentGene = this.geneService.getCurrentGene();
        // Create a symbol scale based on d3 types, then make the accessor
        // return two different types
        let symbolScale = d3.scale.ordinal().range(d3.svg.symbolTypes);
        let symbolAccessor = <any>function(d) {
            return symbolScale(
                (d.key[2] === currentGene.hgnc_symbol) ? '1' : '0'
            )
        };
        // Add the scatter plot as a sub chart of a series chartso we can render two
        // series of genes, the selected and the non selected ones
        this.subChart = function(c) {
            return dc.scatterPlot(c)
                //['useCanvas'](true)
                .symbol(symbolAccessor)
                .symbolSize(5)
                .highlightedSize(10)
                .renderTitle(true)
                .brushOn(false)
                .title(function (p) {
                    return [
                        'Log Fold Change: ' + self.decimalPipe.transform(+p.key[0]),
                        '-log10(Adjusted p-value): ' + self.decimalPipe.transform(+p.key[1])
                    ].join('\n');
                });
        };
        this.chart = dc.seriesChart(this.scatterPlot.nativeElement)
            .x(d3.scale.linear().domain([this.geneService.minLogFC*1.1, this.geneService.maxLogFC*1.1]))
            .chart(this.subChart)
            .brushOn(false)
            .xAxisLabel(this.info.xAxisLabel)
            .yAxisLabel(this.info.yAxisLabel)
            .clipPadding(10)
            .dimension(this.dim)
            .group(this.group)
            //.elasticY(true)
            //.mouseZoomable(true)
            .shareTitle(false)
            // Using this notation because the typings for dc do not show this method for this chart
            ['seriesAccessor'](function(d) {
                return (d.key[2] === currentGene.hgnc_symbol) ? '1' : '0';
            })
            .keyAccessor(function(d) {return +d.key[0];})
            .valueAccessor(function(d) { return +d.key[1]; });

        // Separate this call so we can get the correct chart reference below
        this.chart.yAxis().tickFormat(function(d) { return d3.format(',d')(d); });

        // Register the scatter plot pretransition event
        this.registerChartEvent(this.chart, 'pretransition');

        this.chart.render();
    }

    registerChartEvent(chart: dc.SeriesChart, type: string = 'renderlet') {
        let self = this;
        chart.on(type, function (chart) {
            if (!self.svgAdded) {
                let blackGenes = chart.selectAll('g.sub._0 path.symbol');
                let redGenes = chart.selectAll('g.sub._1 path.symbol');

                // Make the selection render for last
                self.moveToFront(redGenes);

                // Add a black and white gradient to the non selected genes
                let svg = d3.select(self.scatterPlot.nativeElement).select('svg');
                self.addGradientToSVG(blackGenes, svg, 'black-gradient', [
                    {
                        'offset': '0%', 'stop-color': 'white'
                    }, {
                        'offset': '60%', 'stop-color': 'black'
                    }
                ]);

                // Add a red color tothe selected genes
                redGenes
                    .style('stroke', 'white')
                    .style('fill', 'red')
                    .style('stroke-width', 0.5);

                self.svgAdded = true;
            }
        });
    }

    // Make the selection the last in the parent order
    moveToFront(sel: d3.Selection<any>) {
        sel.each(function() {
            this.parentNode.appendChild(this);
        });
    }

    // Adds a gradient color to an SVG, uses offset and stop color
    addGradientToSVG(parent: d3.Selection<any>, svg: d3.Selection<any>, name: string, options: any[]) {
        let gradient = svg.append("defs")
            .append("radialGradient")
            .attr('id', name);

        options.forEach(o => {
            gradient.append('stop')
                .attr('offset', o.offset)
                .attr('stop-color', o['stop-color'])
        })

        parent.style('fill', 'url(#'+name+')');
    }
}
