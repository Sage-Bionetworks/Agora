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

import { ChartService } from '../../services';
import { DataService, GeneService } from '../../../core/services';

import { Proteomics } from 'app/models';

import { Subscription } from 'rxjs';

import * as d3 from 'd3';
import * as dc from 'dc';

@Component({
    selector: 'pbox-plot',
    templateUrl: './pbox-plot-view.component.html',
    styleUrls: [ './pbox-plot-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class PBoxPlotViewComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('chart', {static: false}) boxPlot: ElementRef;
    @ViewChild('bpcol', {static: false}) bpCol: ElementRef;
    @Input() paddingLR: number = 15;
    @Input() paddingUD: number = 0;
    @Input() title: string;
    @Input() chart: any;
    @Input() info: any;
    @Input() label: string = 'pbox-plot';
    @Input() dim: any;
    @Input() group: any;
    @Input() rcBigRadius: number = 12.5;
    @Input() rcSmallRadius: number = 9;
    @Input() rcRadius: number = 12.5;
    @Input() boxRadius: number = 9;

    firstRender: boolean = true;
    max: number = -Infinity;
    oldMax: number = -Infinity;
    counter: number = 0;
    routerSubscription: Subscription;
    chartSubscription: Subscription;

    // Define the div for the tooltip
    div: any = d3.select('body').append('div')
        .attr('class', 'pbp-tooltip')
        .style('width', 50)
        .style('height', 160)
        .style('opacity', 0);
    sDiv: any = d3.select('body').append('div')
        .attr('class', 'pbp-axis-tooltip')
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
        this.routerSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.removeSelf();
            }
        });
        this.location.onPopState(() => {
            this.removeSelf();
        });

        this.chartSubscription = this.chartService.chartsReady$.subscribe((state: boolean) => {
            if (state) {
                this.updateCircleRadius();
                this.initChart();
            }
        });
    }

    removeSelf() {
        this.removeChart();
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
        if (this.chartSubscription) {
            this.chartSubscription.unsubscribe();
        }
        this.geneService.setEmptyGeneState(true);
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
        // Registers this chart
        this.chartService.addChartName(this.label, 'Proteomics');
    }

    ngOnDestroy() {
        // Remove tooltips
        d3.select('.bp-tooltip').remove();
        d3.select('.bp-axis-tooltip').remove();
        d3.select('.rc-tooltip').remove();
        d3.select('.mc-tooltip').remove();
        d3.select('.pbp-tooltip').remove();
        d3.select('.pbp-axis-tooltip').remove();

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
        const self = this;
        this.info = this.chartService.getChartInfo(this.label, 'Proteomics');

        const bpDim = {
            filter: () => {
                //
            },
            filterAll: () => {
                //
            }
        };

        const bpGroup = {
            all() {
                const currentGenes: Proteomics[] = self.geneService.getGeneProteomics().slice();
                if (currentGenes.length !==
                    self.chartService.filteredData['bpGroup'].values.length &&
                    currentGenes.length <
                    self.chartService.filteredData['bpGroup'].values.length) {
                    const indices: number[] = [];
                    self.chartService.filteredData['bpGroup'].values.
                        forEach((v: any, i: number) => {
                        // We got an extra group entry, currentGenes is correct, but the
                        // group coming from the server isn't
                        if (!currentGenes.some((g: Proteomics) => g.tissue === v.key)) {
                            indices.push(i);
                        }
                    });
                    if (indices.length > 0) {
                        for (let i = indices.length - 1; i >= 0; i--) {
                            self.chartService.filteredData['bpGroup'].values.splice(indices[i], 1);
                        }
                    }
                }
                return self.chartService.filteredData['bpGroup'].values;
            },
            order() {
                //
            },
            top() {
                //
            }
        };

        this.dim = bpDim;
        this.group = bpGroup;

        this.getChartPromise().then((chart: any) => {
            this.chart = chart;

            if (this.info.attr !== 'log2_fc') { chart.yAxis().tickFormat(d3.format('.1e')); }

            // Remove filtering for this chart
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
                .on('preRedraw', function(chart) {
                    // Always remove circles
                    d3.selectAll('circle').remove();
                })
                .on('renderlet', function(chart) {
                    dc.events.trigger(function() {
                        chart.selectAll('rect.box')
                            .attr('rx', self.boxRadius);

                        if (chart.selectAll('g.box circle').empty()) {
                            self.renderRedCircles(chart);
                        }
                    });

                    if (self.firstRender) {
                        self.firstRender = false;
                        // Adds tooltip below the x axis labels
                        self.addXAxisTooltips(chart);
                    }
                });

            resolve(chartInst);
        });
    }

    updateYDomain() {
        // Draw the horizontal lines
        const currentGenes = this.dataService.getGeneEntries().slice().filter((g) => {
            return g.model === this.geneService.getCurrentModel();
        });
        currentGenes.forEach((g) => {
            if (Math.abs(+g.logfc) > this.max) {
                this.max = Math.abs(+g.logfc);
            }
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
                        document.getElementsByClassName('pbp-axis-tooltip')[0] as HTMLElement;
                    // Represents the width of each x axis tick section
                    // We get the total column width, minus both side paddings,
                    // and we divide by all tissues plus 1. Five sections total
                    const tickSectionWidth = (
                        (colWidth - (self.paddingLR * 2)) /
                        (self.geneService.getNumOfPTissues() + 1)
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
                                left + self.paddingLR + 30 + xTickPos -
                                (tooltip.offsetWidth / 2.0)
                            ) + 'px'
                        )
                        .style('top',
                            (
                                self.bpCol.nativeElement.offsetTop
                                + chart.height()
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

    renderRedCircles(chart: dc.BoxPlot) {
        const self = this;
        const lineCenter = chart.selectAll('line.center');
        const yDomainLength = Math.abs(chart.yAxisMax() - chart.yAxisMin());
        const mult = (self.boxPlot.nativeElement.offsetHeight - 60) / yDomainLength;
        const currentProteomics = this.geneService.getGeneProteomics().slice().filter(
            (p: Proteomics) => {
                return p.log2_fc && p.uniprotid === self.geneService.getCurrentProtein();
            }
        );

        const logVals: number[] = [];
        const phrases: string[] = [];
        const significanceTexts: string[] = [];
        currentProteomics.forEach((p: Proteomics) => {
            logVals.push(p.log2_fc);
            significanceTexts.push((p.cor_pval <= 0.05) ?
            ' ' : 'not ');
            phrases.push(p.hgnc_symbol + ' is ' + significanceTexts[significanceTexts.length - 1] +
                'significantly differentially expressed in ' +
                p.tissue +
                ' with a log fold change value of ' + p.log2_fc + ' and an adjusted p-value of ' +
                p.cor_pval + '.');
        });

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

        const selection = chart.select('g.axis.x').node();
        if (selection !== null) {
            const parentNode = selection.parentNode;
            const xAxisNode = selection;
            const firstChild = parentNode.firstChild;
            if (firstChild) {
                parentNode.insertBefore(xAxisNode, firstChild);
            }
        }
    }

    onResize(event?: any) {
        const self = this;

        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(function() {
            self.updateCircleRadius();

            self.chart
                .width(self.boxPlot.nativeElement.offsetWidth)
                .height(self.boxPlot.nativeElement.offsetHeight);

            if (self.chart.rescale) {
                self.chart.rescale();
            }

            // Run code here, resizing has "stopped"
            self.chart.redraw();
        }, 100);
    }
}
