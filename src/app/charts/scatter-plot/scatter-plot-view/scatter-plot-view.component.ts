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
        let currentGene = this.geneService.getCurrentGene();
        let filterTissues = this.geneService.getTissues();
        let filterModels = this.geneService.getModels();
        let dim = this.dataService.getDimension(this.label, this.info, currentGene, filterTissues, filterModels);
        let group = this.dataService.getGroup(this.label, this.info);
        this.title = this.info.title;

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
            .x(d3.scale.linear().domain([this.geneService.minLogFC*1.1, this.geneService.maxLogFC*1.1]))
            .y(d3.scale.linear().domain([0, this.geneService.maxAdjPVal*1.1]))
            .xAxisLabel(this.info.xAxisLabel)
            .yAxisLabel(this.info.yAxisLabel)
            .dimension(dim)
            .group(group)
            .mouseZoomable(true)
            //.symbol(symbolAccessor)
            //.symbolSize(7)
            .highlightedSize(15)
            .renderTitle(true)
            .title(function (p) {
                return [
                    'Log Fold Change: ' + self.decimalPipe.transform(+p.key[0]),
                    '-log10(Adjusted p-value): ' + self.decimalPipe.transform(+p.key[1])
                ].join('\n');
            })
            .colors(d3.scale.ordinal().domain(['yes', 'no']).range(['red', 'black']))
            .colorAccessor(function (d) {
                if (d.key[2] === currentGene.hgnc_symbol) {
                    return "yes";
                } else {
                    return "no";
                }
            })
            .brushOn(false);

        // Separate this call so we can get the correct chart reference below
        this.chart.yAxis().tickFormat(function(d) { return d3.format(',d')(d); });

        // Register the scatter plot pretransition event
        //this.registerChartEvent(this.chart, 'pretransition');

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
