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
import { PlotHelperService } from '../../../shared/services';

import { Subscription } from 'rxjs';

import * as d3 from 'd3';
import * as dc from 'dc';

import { DataService, GeneService } from '../../../core/services';

@Component({
    selector: 'box-plot',
    templateUrl: './box-plot-view.component.html',
    styleUrls: [ './box-plot-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class BoxPlotViewComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('chart', {static: false}) boxPlot: ElementRef;
    @ViewChild('bpcol', {static: false}) bpCol: ElementRef;
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
    @Input() boxRadius: number = 8;

    firstRender: boolean = true;
    max: number = -Infinity;
    oldMax: number = -Infinity;
    display: boolean = false;
    counter: number = 0;
    routerSubscription: Subscription;
    chartSubscription: Subscription;

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
        private chartService: ChartService,
        private plotHelperService: PlotHelperService
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
            this.updateCircleRadius();
            this.initChart();
        });
    }

    removeSelf() {
        this.display = false;
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
        this.display = true;
        // Registers this chart
        this.chartService.addChartName(this.label);
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
        this.info = this.chartService.getChartInfo(this.label);

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
                const distributionData = self.dataService.getRnaDistributionData().filter((data) => {
                    return data.model === self.geneService.getCurrentModel();
                });

                return distributionData.map((data) => {
                    data['key'] = data['tissue'];
                    data['value'] = [data['min'], data['median'], data['max']];
                    return data;
                });
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

            if (this.info.attr !== 'fc') { chart.yAxis().tickFormat(d3.format('.1e')); }

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
            const chartInst = this.plotHelperService.boxPlot(this.boxPlot.nativeElement)
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

                        self.chartService.addChartRendered(self.label);
                    }
                });

            resolve(chartInst);
        });
    }

    addXAxisTooltips(chart: any) {
        const self = this;
        chart.selectAll('g.axis.x g.tick').each(function() {
            const text = d3.select(this).select('text');
            const textElement = text.node() as HTMLElement;
            const line = d3.select(this).select('line').node() as HTMLElement;

            text
                .on('mouseover', function() {
                    const textElementRec = textElement.getBoundingClientRect();

                    // Get the text based on the brain tissue
                    self.sDiv.html(self.chartService.getTooltipText(text.text()));

                    // Position the tooltip
                    self.sDiv
                        .style('left',
                            (
                                // Left position of the tick line minus half the tooltip width to center.
                                line.getBoundingClientRect().left - (self.sDiv.node().offsetWidth / 2)
                            ) + 'px'
                        )
                        .style('top',
                            (
                                // Position at the bottom on the label + 15px
                                window.pageYOffset + textElementRec.top + textElementRec.height + 15
                            ) + 'px'
                        );

                    // Shows the tooltip
                    self.sDiv.transition()
                        .duration(200)
                        .style('opacity', 1);
                })
                .on('mouseout', function() {
                    self.sDiv.transition()
                        .duration(500)
                        .style('opacity', 0);
                });
        });
    }

    removeRedCircle(chart: any) {
        chart.selectAll('g.box circle').remove();
    }

    renderRedCircles(chart: any, translate?: boolean) {
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
            logVals.push(self.dataService.getSignificantFigures(g.logfc));
            significanceTexts.push((g.adj_p_val <= 0.05) ?
            ' ' : 'not ');
            phrases.push((g.hgnc_symbol || g.ensembl_gene_id) +
                ' is ' + significanceTexts[significanceTexts.length - 1] +
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
                    .style('stroke-width', 0)
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
