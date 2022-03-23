import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    Input,
    OnDestroy,
    AfterViewInit,
} from '@angular/core';

import { PlatformLocation } from '@angular/common';
import { Router } from '@angular/router';
import { ChartService } from '../../services';
import { DataService, GeneService } from '../../../core/services';
import * as d3 from 'd3';

@Component({
    selector: 'candlestick-chart',
    templateUrl: './candlestick-chart-view.component.html',
    styleUrls: ['./candlestick-chart-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CandlestickChartViewComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('chart', {static: false}) candleStickChart: ElementRef;
    @Input() hgicId: string = '';

    dataEmpty: boolean = true;
    rawData: any;
    chartData: any[] = [];
    label: string = 'candlestick-plot';

    // Define the div for the tooltip
    xAxisTooltip: any = d3.select('body').append('div')
        .attr('class', 'cc-axis-tooltip')
        .style('width', 50)
        .style('height', 160)
        .style('opacity', 0);

    private maxValue: number = 2.0;
    private minValue: number = 0.0;
    private chartHeight: number = 500;
    private component: any = null;
    private tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> = null;

    constructor(
        private location: PlatformLocation,
        private router: Router,
        private dataService: DataService,
        private geneService: GeneService,
        private chartService: ChartService
    ) {
    }

    ngOnInit() {
        const evidenceData = this.dataService.getEvidenceData();
        this.rawData = evidenceData['rnaCorrelation'];
        if (this.rawData.length > 0) {
            this.dataEmpty = false;
        }
    }

    ngOnDestroy() {
        d3.select(window).on('resize.' + this.label, null);
        this.dataEmpty = true;
    }

    ngAfterViewInit() {
        if (!this.dataEmpty) {
            this.formatData();
            this.initChart();
        }
    }

    getContainerWidth(chart) {
        return chart.parentNode.offsetWidth;
    }

    initChart() {
        this.component = d3.select(this.candleStickChart.nativeElement);
        this.tooltip = this.createTooltip(`${this.label}-tooltip`);
        this.getChartPromise().then(() => {
            d3.select(window).on('resize.' + this.label, this.renderChart.bind(this));
        });
    }

    formatData() {
        const filtered = this.rawData.filter(item => item.neuropath_type !== 'DCFDX');
        this.chartData = filtered.map(item => {
            const data = {
                key: item.neuropath_type,
                ensg: item.ensg,
                value: {
                    min: item.ci_lower,
                    max: item.ci_upper,
                    mean: item.oddsratio,
                    pval_adj: item.pval_adj
                }
            };
            return data;
        });
    }

    getChartPromise(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.renderChart();
            resolve(true);
        });
    }

    renderChart() {

        // Remove duplicate charts on page
        if (d3.select(`.${this.label}-svg`) !== undefined) {
            d3.select(`.${this.label}-svg`).remove();
        }

        const svg = this.component.append('svg');
        const container = { width: this.getContainerWidth(svg.node()), height: this.chartHeight };
        const margin = { top: 100, right: 0, bottom: 50, left: 100 };
        const width = container.width - margin.left - margin.right;
        const height = container.height - margin.top - margin.bottom;
        const color = '#5171C0';

        svg.attr('width', container.width)
            .attr('height', container.height)
            .attr('class', `${this.label}-svg`);

        const group = svg.append('g')
            .attr('transform', `translate(${margin.left}, 10)`);

        // Draw X axis
        const x = d3.scaleBand()
            .range([0, width])
            .domain(this.chartData.map(item => {
                return item.key;
            }))
            .paddingInner(1)
            .paddingOuter(.5);

        group.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .attr('class', 'axis x-axis')
            .call(d3.axisBottom(x));

        // Draw X axis title
        group.append('text')
            .attr('transform',
                'translate(' + (width / 2) + ' ,' +
                (height + margin.top) + ')')
            .style('text-anchor', 'middle')
            .style('font-weight', 'bold')
            .text('PHENOTYPE');

        // Draw Y axis
        const y = d3.scaleLinear()
            .domain([this.minValue, this.maxValue])
            .range([height, 0]);

        group.append('g')
            .attr('class', 'axis y-axis')
            .call(d3.axisLeft(y));

        // Draw Y axis title
        group.append('text')
            .attr('transform', `rotate(-90) translate(${-height / 2}, ${-margin.left / 2})`)
            .style('text-anchor', 'middle')
            .style('font-weight', 'bold')
            .text('ODDS RATIO');

        // Draw vertical lines
        group.selectAll('.vertLines')
            .data(this.chartData)
            .enter()
            .append('line')
            .attr('class', 'vertLines')
            .attr('x1', d => x(d.key))
            .attr('x2', d => x(d.key))
            .attr('y1', d => y(d.value.min))
            .attr('y2', d => y(d.value.max))
            .attr('stroke', color)
            .attr('stroke-width', 1.5);

        // Draw mid circle (mean value)
        group.selectAll('.meanCircle')
            .data(this.chartData)
            .enter()
            .append('circle')
            .attr('class', 'meanCircle')
            .attr('cx', d => x(d.key))
            .attr('cy', d => y(d.value.mean))
            .attr('r', 9)
            .attr('stroke', color)
            .style('fill', color)
            .on('mouseover', d => {
                const isOrNot = d.value.pval_adj <= 0.05 ? 'is' : 'is not';
                const msg = `${this.hgicId} ${isOrNot} significantly correlated with ${d.key}, with an odds ratio of ${d.value.mean} and an adjusted p-value of ${d.value.pval_adj}.`;
                this.showTooltip(this.tooltip, msg);
            })
            .on('mouseout', d => this.hideTooltip(this.tooltip));

        // Add red horizontal line
        group.append('g')
            .attr('transform', `translate(0,${y(1.0)})`)
            .append('line')
            .attr('class', 'yAxisGuide')
            .attr('x2', width)
            .style('stroke', 'red')
            .style('stroke-width', '1px');

        this.addXAxisTooltips(this.component);
    }

    createTooltip(name) {
        return d3.select('body').append('div')
            .attr('class', `${name}`)
            .style('opacity', 0);
    }

    showTooltip(tooltip, msg) {
        tooltip.transition()
            .duration(200)
            .text(msg)
            .style('opacity', 1)
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY + 30) + 'px');
    }

    hideTooltip(tooltip) {
        tooltip.transition()
            .duration(500)
            .style('opacity', 0);
    }

    addXAxisTooltips(chart) {
        const self = this;
        chart.selectAll('g.x-axis g.tick').each(function() {
            const text = d3.select(this).select('text');
            const textElement = text.node() as HTMLElement;
            const line = d3.select(this).select('line').node() as HTMLElement;

            text
                .on('mouseover', function() {
                    const textElementRec = textElement.getBoundingClientRect();

                    // Get the text based on the brain tissue
                    self.xAxisTooltip.html(self.chartService.getTooltipText(text.text()));

                    // Position the tooltip
                    self.xAxisTooltip
                        .style('left',
                            (
                                // Left position of the tick line minus half the tooltip width to center.
                                line.getBoundingClientRect().left - (self.xAxisTooltip.node().offsetWidth / 2)
                            ) + 'px'
                        )
                        .style('top',
                            (
                                // Position at the bottom on the label + 15px
                                window.pageYOffset + textElementRec.top + textElementRec.height + 15
                            ) + 'px'
                        );

                    // Shows the tooltip
                    self.xAxisTooltip.transition()
                        .duration(200)
                        .style('opacity', 1);
                })
                .on('mouseout', function() {
                    self.xAxisTooltip.transition()
                        .duration(500)
                        .style('opacity', 0);
                });
        });
    }
}
