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
    @ViewChild('barchart', {static: true}) medianChart: ElementRef;
    @ViewChild('bccol', {static: true}) bcCol: ElementRef;
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
        this.routerSubscription = this.router.events.subscribe((event) => {
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
        const data = this.geneinfo.medianexpression.filter(
            d => d.medianlogcpm && d.medianlogcpm > 0 ? true : false
        );
        this.ndx = crossfilter(data);
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
            .yAxisLabel('LOG2 CPM', 20);
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
                return self.dataService.getSignificantFigures(+d.value);
            })
            .brushOn(false)
            .turnOnControls(false)
            .xUnits(dc.units.ordinal)
            .colors(['#5171C0'])
            .renderTitle(false)
            .on('renderlet', (chart) => {
                if (chart) {
                    const yDomainLength = Math.abs(chart.y().domain()[1]
                        - chart.y().domain()[0]);
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
                        .y((d: any) => (Math.abs(chart.y().domain()[1] - Math.log2(5)) * mult));
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

                    self.chartService.addChartRendered(self.label);
                }
            });

        this.chart.yAxis().ticks(3);
        this.chart.filter = () => '';
        this.chart.render();
    }

    addXAxisTooltips(chart: dc.BoxPlot) {
        const self = this;
        chart.selectAll('g.axis.x g.tick').each(function() {
            const text = d3.select(this).select('text');
            const textElement = text.node() as HTMLElement;
            const line = d3.select(this).select('line').node() as HTMLElement;

            text
                .on('mouseover', function() {
                    const textElementRec = textElement.getBoundingClientRect();

                    // Get the text based on the brain tissue
                    self.div.html(self.chartService.getTooltipText(text.text()));

                    // Position the tooltip
                    self.div
                        .style('left',
                            (
                                // Left position of the tick line minus half the tooltip width to center.
                                line.getBoundingClientRect().left - (self.div.node().offsetWidth / 2)
                            ) + 'px'
                        )
                        .style('top',
                            (
                                // Position at the bottom on the label + 15px
                                window.pageYOffset + textElementRec.top + textElementRec.height + 15
                            ) + 'px'
                        );

                    // Shows the tooltip
                    self.div.transition()
                        .duration(200)
                        .style('opacity', 1);
                })
                .on('mouseout', function() {
                    self.div.transition()
                        .duration(500)
                        .style('opacity', 0);
                });
        });
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
