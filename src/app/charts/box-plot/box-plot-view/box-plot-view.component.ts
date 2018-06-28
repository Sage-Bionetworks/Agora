import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    Input
} from '@angular/core';
import { DecimalPipe } from '@angular/common';

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
    // Define the div for the tooltip
    div: any = d3.select('body').append('div')
        .attr('class', 'bp-tooltip')
        .style('opacity', 0);

    private resizeTimer;

    constructor(
        private dataService: DataService,
        private geneService: GeneService,
        private chartService: ChartService,
        private decimalPipe: DecimalPipe
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
            // .renderDataPoints(true)
            .renderTitle(true)
            .yAxisLabel(this.info.yAxisLabel)
            .showOutliers(false)
            .dataWidthPortion(0.1)
            .dataOpacity(0)
            .colors('transparent')
            .on('filtered', (chart) => {
                this.renderRedCircle(chart, true);
            })
            /*.on('preRender', (chart) => {
                // Adjust the Y axis on preRender
                chart.y(this.getYScale(this.info.attr));
            })
            .on('preRedraw', (chart) => {
                // Adjust the Y axis on preRedraw
                chart.y(this.getYScale(this.info.attr));
            })*/
            // .y(this.getYScale(this.info.attr))
            // .tickFormat(d3.format('.3f'));
            .tickFormat(() => '');

        if (this.info.attr !== 'fc') { this.chart.yAxis().tickFormat(d3.format('.1e')); }
        // Remove filtering for these charts
        this.chart.filter = function() {
            //
        };
        this.chart.margins().left = 70;

        this.registerChartEvent(this.chart, 'postRedraw');
        this.registerChartEvent(this.chart, 'postRender');

        this.chart.render();
    }

    getNearestPot(num: number, multpl: number, upper?: boolean): number {
        if (num >= 1) {
            return Math.pow(multpl, Math.ceil(Math.log(num) / Math.log(multpl)));
        }
        let accum = 1;
        while (num * accum < multpl) {
            accum *= multpl;
        }
        num = Math.ceil(num * accum) / accum;

        return (upper) ? num : (num / multpl);
    }

    getYScale(attr: string): d3.ScaleContinuousNumeric<number, number> {
        const minMaxArray = this.group.all()[0].value.slice();
        const max = minMaxArray.reduce(function(a, b) {
            return Math.max(a, b);
        });
        const min = minMaxArray.reduce(function(a, b) {
            return Math.min(a, b);
        });
        // const multpl = (attr === 'fc') ? 2 : 10;
        // max = this.getNearestPot(max, multpl, true);
        // min = this.getNearestPot(min, multpl);

        // return d3.scaleLog().base(multpl).domain([min, max]);
        return d3.scaleLinear().domain([min, max]);
    }

    // A custom renderlet function for this chart, allows us to change
    // what happens to the chart after rendering
    registerChartEvent(chartEl: dc.BoxPlot, type: string = 'renderlet') {
        const self = this;
        // Using a different name for the chart variable here so it's not shadowed
        chartEl.on(type, function(chart, typeEl) {
            chart.selectAll('rect.box')
                .append('title')
                .text(function() {
                    return 'src: log2(fold change)';
                });

            // Renders the selected gene circle
            (typeEl === 'postRender') ? self.renderRedCircle(chart, true) :
                self.renderRedCircle(chart);

            /*
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
            });*/
        });
    }

    renderRedCircle(chart: dc.BoxPlot, translate?: boolean) {
        const self = this;
        const lineCenter = chart.selectAll('line.center');
        const yDomainLength = Math.abs(chart.y().domain()[1] - chart.y().domain()[0]);
        const svgEl = (chart.selectAll('g.axis.y').node() as SVGGraphicsElement);
        const mult = (svgEl.getBBox().height - 10) / yDomainLength;

        if (!translate) {
            const val = self.currentGene[self.info.attr];
            let logVal = (self.info.attr === 'fc') ? Math.log2(val) : Math.log10(val);
            logVal = +this.decimalPipe.transform(logVal, '1.3');
            chart.selectAll('g.box')
                .append('circle')
                .style('cx', lineCenter.attr('x1'))
                .style('cy', Math.abs(chart.y().domain()[1] - logVal) * mult)
                .style('fill', '#FCA79A')
                .style('stroke', '#F47E6C')
                .style('stroke-width', 3)
                .style('r', 13.6)
                .style('opacity', 1)
                .on('mouseover', function(d) {
                    self.div.transition()
                        .duration(200)
                        .style('opacity', .9);
                    self.div.html(logVal)
                        .style('left', (d3.event.pageX) + 'px')
                        .style('top', (d3.event.pageY - 28) + 'px');
                    })
                .on('mouseout', function(d) {
                    self.div.transition()
                        .duration(500)
                        .style('opacity', 0);
                });
        } else {
            chart.selectAll('circle')
                .style('cx', lineCenter.attr('x1'))
                .style('cy', this.currentGene[this.info.attr] * mult);
        }
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
