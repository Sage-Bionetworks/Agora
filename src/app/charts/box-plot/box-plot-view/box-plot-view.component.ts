import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    Input
} from '@angular/core';

import { Gene } from '../../../models';

import { ChartService } from '../../services';
import { DataService, GeneService } from '../../../core/services';

import * as d3 from 'd3';
import * as dc from 'dc';

@Component({
    selector: 'box-plot',
    templateUrl: './box-plot-view.component.html',
    styleUrls: [ './box-plot-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class BoxPlotViewComponent implements OnInit {
    @Input() title: string;
    @Input() chart: any;
    @Input() info: any;
    @Input() label: string = '';
    @Input() currentGene = this.geneService.getCurrentGene();
    @Input() dim: any;
    @Input() group: any;

    @ViewChild('chart') boxPlot: ElementRef;

    changedLabels: boolean = false;
    display: boolean = false;
    counter: number = 0;
    geneEntries: Gene[] = [];

    private resizeTimer;

    constructor(
        private dataService: DataService,
        private geneService: GeneService,
        private chartService: ChartService
    ) { }

    ngOnInit() {
        this.initChart();
    }

    initChart() {
        this.geneEntries = this.dataService.getGeneEntries();
        if (!this.info) {
            this.info = this.chartService.getChartInfo(this.label);
        }
        this.dim = this.dataService.getDimension(
            this.info,
            this.currentGene
        );
        this.group = this.dataService.getGroup(this.info);

        this.chart = dc.boxPlot(this.boxPlot.nativeElement);
        this.chart
            .dimension(this.dim)
            .group(this.group)
            .renderDataPoints(true)
            .renderTitle(true)
            .yAxisLabel(this.info.yAxisLabel)
            .dataWidthPortion(0.1)
            .dataOpacity(0)
            .colors('black')
            .transitionDuration(0)
            .on('filtered', (chart) => {
                // Adjust the Y axis on preRender
                this.setYScale(chart, this.info.attr);
            })
            .on('preRender', (chart) => {
                // Adjust the Y axis on preRender
                this.setYScale(chart, this.info.attr);
            })
            .on('preRedraw', (chart) => {
                // Adjust the Y axis on preRedraw
                this.setYScale(chart, this.info.attr);
            });

        // Define the initial Y scale, or adjust it
        this.setYScale(this.chart, this.info.attr);
        // Remove filtering for these charts
        this.chart.filter = function() {
            //
        };

        this.registerChartEvent(this.chart, 'postRedraw');
        this.registerChartEvent(this.chart, 'postRender');

        this.chart.render();
    }

    setYScale(chart: dc.BoxPlot, attr: string) {
        if (attr === 'logfc') {
            chart
                .y(d3.scaleLinear().domain(this.geneService.getFC()))
                .tickFormat(d3.format('.3f'))
                .elasticY(true);
        } else {
            let newMax = chart.group().all()[0].value.reduce(function(a, b) {
                return Math.max(a, b);
            });
            let accum = 1;
            while (newMax * accum < 1) {
                accum *= 10;
            }
            newMax = Math.ceil(newMax * accum) / accum;
            chart
                .y(d3.scaleLog().domain([Math.pow(10, -20), newMax]).clamp(true))
                .tickFormat(d3.format('.3f'));
        }
    }

    // A custom renderlet function for this chart, allows us to change
    // what happens to the chart after rendering
    registerChartEvent(chartEl: dc.BoxPlot, type: string = 'renderlet') {
        const self = this;
        // Using a different name for the chart variable here so it's not shadowed
        chartEl.on(type, function(chart) {
            chart.selectAll('rect.box')
                .append('title')
                .text(function() {
                    return 'src: log2(fold change)';
                });

            const lineCenter = chart.selectAll('line.center');
            chart.selectAll('circle')
                .attr('cx', lineCenter.attr('x1'));

            chart.selectAll('g.axis').each(function() {
                const firstChild = this.parentNode.firstChild;
                if (firstChild) {
                    this.parentNode.insertBefore(this, firstChild);
                }
            });

            // Not using getCurrentGene for all the checks for now
            const filteredGene = self.geneEntries.slice().find((g) => {
                return g.hgnc_symbol === self.geneService.getCurrentGene().hgnc_symbol &&
                    g.tissue === self.geneService.getCurrentTissue() &&
                    g.model === self.geneService.getCurrentModel();
            });
            let foundIndex;
            const foundCircles = chart.selectAll('circle').filter((c, i) => {
                if (chart.group().all()[0].value[i] === +filteredGene[self.info.attr]) {
                    foundIndex = i;
                }
                return chart.group().all()[0].value[i] === +filteredGene[self.info.attr];
            });
            foundCircles
                .style('fill', '#FCA79A')
                .style('stroke', '#F47E6C')
                .style('stroke-width', 3)
                .style('r', 13.6)
                .style('opacity', 1);

            if (foundIndex) {
                chart.selectAll('circle')
                    .filter((c, i) => {
                        return i !== foundIndex;
                    })
                    .style('opacity', 0);
            }

            // Move the red circles to front
            foundCircles.each(function() {
                this.parentNode.appendChild(this);
            });
        });
    }

    onResize(event) {
        const self = this;

        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(function() {
            self.chart
                .width(self.boxPlot.nativeElement.parentElement.offsetWidth)
                .height(self.boxPlot.nativeElement.offsetHeight);

            if (self.chart.rescale) {
                self.chart.rescale();
            }

            // Run code here, resizing has "stopped"
            self.chart.redraw();
        }, 100);
    }
}
