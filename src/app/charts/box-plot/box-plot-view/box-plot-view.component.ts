import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    Input,
    OnDestroy,
    AfterViewInit
} from '@angular/core';

import { PlatformLocation } from '@angular/common';

import { Router, NavigationStart } from '@angular/router';

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
export class BoxPlotViewComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('chart') boxPlot: ElementRef;
    @ViewChild('bpcol') bpCol: ElementRef;
    @Input() paddingLR: number = 15;
    @Input() paddingUD: number = 0;
    @Input() title: string;
    @Input() chart: any;
    @Input() info: any;
    @Input() label: string = 'box-plot';
    @Input() dim: any;
    @Input() group: any;
    @Input() rcBigRadius: number = 12.5;
    @Input() rcSmallRadius: number = 9;
    @Input() rcRadius: number = 12.5;
    @Input() boxRadius: number = 9;

    firstRender: boolean = true;
    max: number = -Infinity;
    display: boolean = false;
    counter: number = 0;
    geneEntries: Gene[] = [];

    // Define the div for the tooltip
    div: any = d3.select('body').append('div')
        .attr('class', 'bp-tooltip')
        .style('width', 50)
        .style('height', 160)
        .style('opacity', 0);
    sDiv: any = d3.select('body').append('div')
        .attr('class', 'bp-axis-tooltip')
        .style('width', 50)
        .style('height', 160)
        .style('opacity', 0);

    private resizeTimer;

    constructor(
        private location: PlatformLocation,
        private router: Router,
        private dataService: DataService,
        private geneService: GeneService,
        private chartService: ChartService
    ) { }

    ngOnInit() {
        // If we move away from the overview page, remove
        // the charts
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.display = false;
                this.removeChart();
            }
        });
        this.location.onPopState(() => {
            this.display = false;
            this.removeChart();
        });

        this.chartService.chartsReady$.subscribe((state: boolean) => {
            if (state) {
                this.updateCircleRadius();
                this.initChart();
            }
        });
    }

    removeChart() {
        if (this.chart) {
            this.chartService.removeChart(
                this.chart, this.chart.group(),
                this.chart.dimension()
            );
            this.chartService.removeChartName(this.label);
            this.chart = null;
            this.geneService.setPreviousGene(this.geneService.getCurrentGene());
        }
    }

    ngAfterViewInit() {
        this.display = true;
        // Registers this chart
        this.chartService.addChartName(this.label);
    }

    ngOnDestroy() {
        this.chartService.removeChart(this.chart);
    }

    getModel(): string {
        const model = this.geneService.getCurrentModel();
        return (model) ? model : '';
    }

    updateCircleRadius() {
        if (window.innerWidth < 768) {
            this.rcRadius = this.rcSmallRadius;
        } else {
            this.rcRadius = this.rcBigRadius;
        }
    }

    initChart() {
        this.geneEntries = this.dataService.getGeneEntries();
        this.info = this.chartService.getChartInfo(this.label);
        this.dim = this.dataService.getNdx().dimension((d) => d.tissue);

        this.group = this.dim.group().reduce(
            function(p, v) {
                // Retrieve the data value, if not Infinity or null add it.
                const dv = Math.log2(v.fc);
                if (dv !== Infinity && dv !== null) {
                    p.push(dv);
                }
                return p;
            },
            function(p, v) {
                // Retrieve the data value, if not Infinity or null remove it.
                const dv = Math.log2(v.fc);
                if (dv !== Infinity && dv !== null) {
                    p.splice(p.indexOf(dv), 1);
                }
                return p;
            },
            function() {
                return [];
            }
        );

        this.getChartPromise().then((chart: any) => {
            this.chart = chart;

            if (this.info.attr !== 'fc') { chart.yAxis().tickFormat(d3.format('.1e')); }

            // Remove filtering for these charts
            chart.filter = function() {
                //
            };
            chart.margins({
                left: 90,
                right: 30,
                bottom: 50,
                top: 10
            });

            chart.render();
        });
    }

    getChartPromise(): Promise<dc.BoxPlot> {
        const self = this;
        return new Promise((resolve, reject) => {
            const chartInst = dc.boxPlot(this.boxPlot.nativeElement)
                .dimension(this.dim)
                .yAxisLabel('LOG 2 FOLD CHANGE', 20)
                .group(this.group)
                .renderTitle(true)
                ['showOutliers'](false)
                .dataWidthPortion(0.1)
                .dataOpacity(0)
                .colors('transparent')
                .tickFormat(() => '')
                .elasticX(true)
                .elasticY(true)
                .yRangePadding(this.rcRadius * 1.5)
                .on('renderlet', function(chart) {
                    if (!chart.selectAll('g.box circle').empty()) {
                        dc.events.trigger(function() {
                            self.renderRedCircles(chart, true);
                        });
                    }

                    if (self.firstRender) {
                        self.firstRender = false;

                        dc.events.trigger(function() {
                            chart.selectAll('rect.box')
                                .attr('rx', self.boxRadius);

                            if (chart.selectAll('g.box circle').empty()) {
                                self.renderRedCircles(chart);
                            }
                        });

                        // Adds tooltip below the x axis labels
                        self.addXAxisTooltips(chart);
                    }
                });

            resolve(chartInst);
        });
    }

    addXAxisTooltips(chart: dc.BoxPlot) {
        const self = this;
        chart.selectAll('g.axis.x g.tick text').each(function(d, i) {
            const n = d3.select(this).node();
            d3.select(this)
                .on('mouseover', function() {
                    // The space between the beginning of the page and the column
                    const left = self.bpCol.nativeElement.getBoundingClientRect().left;
                    // Total column width, including padding
                    const colWidth = self.bpCol.nativeElement.offsetWidth;
                    // Shows the tooltip
                    self.sDiv.transition()
                        .duration(200)
                        .style('opacity', 1);
                    // Get the text based on the brain tissue
                    self.sDiv.html(self.chartService.getTooltipText(d3.select(this).text()));

                    // The tooltip element, we need half of the width
                    const tooltip =
                        document.getElementsByClassName('bp-axis-tooltip')[0] as HTMLElement;
                    // Represents the width of each x axis tick section
                    // We get the total column width, minus both side paddings,
                    // and we divide by all tissues plus 1. Eight sections total
                    const tickSectionWidth = (
                        (colWidth - (self.paddingLR * 2)) /
                        (self.geneService.getNumOfTissues() + 1)
                    );
                    // The start position for the current section tick will be
                    // the width of a section * current index + one
                    const xTickPos = tickSectionWidth * (i + 1);
                    self.sDiv
                        .style('left',
                            (
                                // The most important calculation. We need the space
                                // between the beginning of the page and the column,
                                // plus the left padding, plus half the width of a
                                // vertical bar, plus the current tick position and we
                                // subtract half the width of the tooltip
                                left + self.paddingLR + 35 + xTickPos -
                                (tooltip.offsetWidth / 2.0)
                            ) + 'px'
                        )
                        .style('top',
                            (
                                self.bpCol.nativeElement.offsetParent.offsetTop
                                + chart.height() + 60
                            ) + 'px'
                        );
                })
                .on('mouseout', function() {
                    self.sDiv.transition()
                        .duration(500)
                        .style('opacity', 0);
                });
        });
    }

    removeRedCircle(chart: dc.BoxPlot) {
        chart.selectAll('g.box circle').remove();
    }

    renderRedCircles(chart: dc.BoxPlot, translate?: boolean) {
        const self = this;
        const lineCenter = chart.selectAll('line.center');
        const yDomainLength = Math.abs(chart.yAxisMax() - chart.yAxisMin());
        const mult = (self.boxPlot.nativeElement.offsetHeight - 60) / yDomainLength;
        const currentGenes = this.dataService.getGeneEntries().slice().filter((g) => {
            return g.model === this.geneService.getCurrentModel();
        });
        const logVals: number[] = [];
        const phrases: string[] = [];
        const significanceTexts: string[] = [];
        currentGenes.forEach((g) => {
            logVals.push(this.dataService.getSignificantValue(g.logfc));
            significanceTexts.push((g.adj_p_val <= 0.05) ?
            ' ' : 'not ');
            phrases.push(g.hgnc_symbol + ' is ' + significanceTexts[significanceTexts.length - 1] +
                'significantly differentially expressed in ' +
                g.tissue +
                ' with a log fold change value of ' + g.logfc + ' and an adjusted p-value of ' +
                g.adj_p_val + '.');
        });

        if (!translate) {
            chart.selectAll('g.box').each(function(el, i) {
                const cy = Math.abs(chart.y().domain()[1] - logVals[i]) * mult;
                const fcy = (isNaN(cy) ? 0.0 : cy);
                d3.select(this)
                    .insert('circle', ':last-child')
                    .attr('cx', lineCenter.attr('x1'))
                    .attr('cy', fcy)
                    .attr('fill', '#F47E6C')
                    .style('stroke', '#F47E6C')
                    .style('stroke-width', 3)
                    .attr('r', self.rcRadius)
                    .attr('opacity', 1)
                    .on('mouseover', function() {
                        self.div.transition()
                            .duration(200)
                            .style('opacity', .9);
                        self.div.html(phrases[i])
                            .style('left', (d3.event.pageX - 60) + 'px')
                            .style('top', (d3.event.pageY + 20) + 'px');
                    })
                    .on('mouseout', function() {
                        self.div.transition()
                            .duration(500)
                            .style('opacity', 0);
                    });
                });

            const parentNode = chart.select('g.axis.x').node().parentNode;
            const xAxisNode = chart.select('g.axis.x').node();
            const firstChild = parentNode.firstChild;
            if (firstChild) {
                parentNode.insertBefore(xAxisNode, firstChild);
            }
        } else {
            chart.selectAll('circle').each(function(el, i) {
                const cy = Math.abs(chart.y().domain()[1] - logVals[i]) * mult;
                const fcy = (isNaN(cy) ? 0.0 : cy);
                d3.select(this)
                    .attr('cx', lineCenter.attr('x1'))
                    .attr('cy', fcy)
                    .on('mouseover', function() {
                        self.div.transition()
                            .duration(200)
                            .style('opacity', .9);
                        self.div.html(phrases[i])
                            .style('left', (d3.event.pageX - 60) + 'px')
                            .style('top', (d3.event.pageY + 20) + 'px');
                    })
                    .on('mouseout', function() {
                        self.div.transition()
                            .duration(500)
                            .style('opacity', 0);
                    });
            });
        }
    }

    onResize(event?: any) {
        const self = this;

        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(function() {
            self.updateCircleRadius();

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
