import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    Input,
    AfterViewInit,
    OnDestroy
} from '@angular/core';

import { PlatformLocation } from '@angular/common';

import { Router, NavigationStart } from '@angular/router';

import { DataService, GeneService } from '../../../core/services';
import { ChartService } from '../../services';

import { Subscription } from 'rxjs';

import * as d3 from 'd3';
import * as dc from 'dc';

import * as crossfilter from 'crossfilter2';

@Component({
    selector: 'median-chart',
    templateUrl: './median-chart-view.component.html',
    styleUrls: ['./median-chart-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MedianChartViewComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('barchart') medianChart: ElementRef;
    @ViewChild('bccol') bcCol: ElementRef;
    @Input() geneinfo: any;
    @Input() paddingLR: number = 15;
    @Input() paddingUD: number = 0;
    @Input() label: string = 'median-chart';
    chart: any;
    ndx: any;
    group: any;
    dimension: any;
    tissuecoresGroup: any;
    routerSubscription: Subscription;
    chartSubscription: Subscription;

    // Define the div for the tooltip
    div: any = d3.select('body').append('div')
        .attr('class', 'mc-tooltip')
        .style('width', 200)
        .style('height', 160)
        .style('opacity', 0);

    private resizeTimer;

    constructor(
        private location: PlatformLocation,
        private router: Router,
        private dataService: DataService,
        private geneService: GeneService,
        private chartService: ChartService
    ) {}

    ngOnInit() {
        // If we move away from the overview page, remove
        // the charts
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.removeSelf();
            }
        });
        this.location.onPopState(() => {
            this.removeSelf();
        });

        if (!this.geneinfo) {
            return;
        }
        this.ndx = crossfilter(this.geneinfo.medianexpression);
        this.group = this.ndx.groupAll();
        this.dimension = this.ndx.dimension( (d) =>  d.tissue );
        this.tissuecoresGroup = this.dimension.group().reduceSum((d) =>
            d.medianlogcpm
        );

        this.chartSubscription = this.chartService.chartsReady$.subscribe((state: boolean) => {
            if (state) {
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

    ngOnDestroy() {
        this.chartService.removeChart(this.chart);
    }

    ngAfterViewInit() {
        // Registers this chart
        this.chartService.addChartName(this.label);
    }

    initChart() {
        const self = this;
        dc['config'].defaultColors(d3.schemeCategory10);
        this.chart = dc.barChart(this.medianChart.nativeElement)
            .yAxisLabel('LOG CPM', 20);
        this.chart.margins({
            left: 70,
            right: 10,
            bottom: 30,
            top: 50
        });
        this.chart
            .barPadding(0.5)
            .renderLabel(true)
            .elasticY(false)
            .dimension(this.dimension)
            .group(this.tissuecoresGroup)
            .x(d3.scaleBand())
            .y(d3.scaleLinear().domain([0, this.tissuecoresGroup.top(1)[0].value]))
            .valueAccessor((d) => {
                return self.dataService.getSignificantValue(+d.value);
            })
            .brushOn(false)
            .turnOnControls(false)
            .xUnits(dc.units.ordinal)
            .colors(['#5171C0'])
            .renderTitle(false)
            .on('renderlet', (chart) => {
                const yDomainLength = Math.abs(this.chart.y().domain()[1]
                - this.chart.y().domain()[0]);
                // if (chart.select('rect').attr('y') === '240' ) {
                //     chart.select('rect').attr('y', 290 );
                // }
                chart.selectAll('rect').each((el, i, tree) => {
                    if (el && el.y <= 0) {
                        tree[i].setAttribute('height', 0);
                    }
                 });
                chart.selectAll('rect').attr('pointer-events', 'none');
                chart.selectAll('text').each((el, i, tree) => {
                    if (el && el['data'] && el['data'].value < 0) {
                        el['data'].value = '';
                        el.y = '';
                        tree[i].innerHTML = '';
                    }
                });
                // const svgEl = (chart.selectAll('g.axis.y').node() as SVGGraphicsElement);
                const mult = chart.effectiveHeight() / yDomainLength;
                const lefty = 0;
                const righty = 0; // use real statistics here!
                const extradata = [{ x: chart.x().range()[0], y: chart.y()(lefty) },
                { x: chart.x().range()[1], y: chart.y()(righty) }];
                const line = d3.line()
                    .x((d: any) =>  d.x)
                    .y((d: any) => (Math.abs(chart.y().domain()[1] - Math.log10(5)) * mult));
                const chartBody = chart.select('g.chart-body');
                let path = chartBody.selectAll('path.extra').data([extradata]);
                path = path
                    .enter()
                    .append('path')
                    .attr('class', 'extra')
                    .attr('stroke', 'red')
                    .attr('id', 'extra-line')
                    .merge(path);
                path.attr('d', line);

                // Adds tooltip below the x axis labels
                self.addXAxisTooltips(chart);
            });

        this.chart.yAxis().ticks(3);
        this.chart.filter = () => '';
        this.chart.render();
    }

    addXAxisTooltips(chart: dc.BarChart) {
        const self = this;
        chart.selectAll('g.axis.x g.tick text').each(function(d, i) {
            d3.select(this)
                .on('mouseover', function() {
                    // The space between the beginning of the page and the column
                    const left = self.bcCol.nativeElement.getBoundingClientRect().left;
                    // Total column width, including padding
                    const colWidth = self.bcCol.nativeElement.offsetWidth;
                    // Shows the tooltip
                    self.div.transition()
                        .duration(200)
                        .style('opacity', 1);
                    // Get the text based on the brain tissue
                    self.div.html(self.getTooltipText(d3.select(this).text()));
                    // The tooltip element, we need half of the width
                    const tooltip =
                        document.getElementsByClassName('mc-tooltip')[0] as HTMLElement;
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
                    self.div
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
                                self.bcCol.nativeElement.offsetTop + chart.height()
                            ) + 'px'
                        );
                })
                .on('mouseout', function() {
                    self.div.transition()
                        .duration(500)
                        .style('opacity', 0);
                });
        });
    }

    getTooltipText(text: string): string {
        switch (text) {
            case 'CBE':
                return 'Cerebellum';
            case 'DLPFC':
                return 'Dorsolateral Prefrontal Cortex';
            case 'FP':
                return 'Frontal Pole';
            case 'IFG':
                return 'Inferior Frontal Gyrus';
            case 'PHG':
                return 'Parahippocampal Gyrus';
            case 'STG':
                return 'Superior Temporal Gyrus';
            case 'TCX':
                return 'Temporal Cortex';
        }
    }

    onResize(event?: any) {
        const self = this;

        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            self.chart
                .width(
                    self.medianChart.nativeElement.parentElement.offsetWidth - (self.paddingLR * 2)
                )
                .height(self.medianChart.nativeElement.offsetHeight - (self.paddingUD * 2));

            if (self.chart.rescale) {
                self.chart.rescale();
            }

            // Run code here, resizing has "stopped"
            self.chart.redraw();
        }, 100);
    }

}
