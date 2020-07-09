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
import { Router, NavigationStart } from '@angular/router';
import { ChartService } from '../../services';
import { DataService, GeneService } from '../../../core/services';
import { Subscription } from 'rxjs';
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

    private rawData: any;
    private chartData: any[] = [];
    private label: string = 'candlestick-plot';
    private maxValue: number = -Infinity;
    private minValue: number = Infinity;
    private chartHeight: number = 500;
    private component: any = null;
    private tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> = null;
    private dataEmpty: boolean = true;

    constructor(
        private location: PlatformLocation,
        private router: Router,
        private dataService: DataService,
        private geneService: GeneService,
        private chartService: ChartService
    ) {
    }

    ngOnInit() {
        this.rawData = this.chartService.filteredData['cpGroup'];
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
        this.createTooltip();
        this.getChartPromise().then(() => {
            d3.select(window).on('resize.' + this.label, this.renderChart.bind(this));
        });
    }

    formatData() {
        this.rawData.forEach(item => {
            const data = {
                key: item.neuropath_type,
                ensembl_gene_id: item.ensembl_gene_id,
                value: {
                    min: item.ci_lower,
                    max: item.ci_upper,
                    mean: item.oddsratio,
                    pval_adj: item.pval_adj
                }
            };
            if (this.maxValue < item.ci_upper) {
                this.maxValue = item.ci_upper;
            }
            if (this.minValue > item.ci_lower) {
                this.minValue = item.ci_lower;
            }
            this.chartData.push(data);
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
        const margin = { top: 50, right: 0, bottom: 50, left: 200 };
        const width = container.width - margin.left - margin.right;
        const height = container.height - margin.top - margin.bottom;
        const color = '#5171C0';

        svg.attr('width', container.width)
            .attr('height', container.height)
            .attr('class', `${this.label}-svg`);

        const group = svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`);

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
        group.selectAll('vertLines')
            .data(this.chartData)
            .enter()
            .append('line')
            .attr('x1', d => x(d.key))
            .attr('x2', d => x(d.key))
            .attr('y1', d => y(d.value.min))
            .attr('y2', d => y(d.value.max))
            .attr('stroke', color)
            .attr('stroke-width', 1.5);

        // Draw mid circle (mean value)
        group.selectAll('meanCircle')
            .data(this.chartData)
            .enter()
            .append('circle')
            .attr('cx', d => x(d.key))
            .attr('cy', d => y(d.value.mean))
            .attr('r', 9)
            .attr('stroke', color)
            .style('fill', color)
            .on('mouseover', d => this.showTooltip(d))
            .on('mouseout', d => this.hideTooltip(d));

    }

    createTooltip() {
        this.tooltip = d3.select('body').append('div')
            .attr('class', `${this.label}-tooltip`)
            .style('opacity', 0);
    }

    showTooltip(d) {
        const isOrNot = d.value.mean > 1.0 ? 'is' : 'is not';
        const tooltip = `${this.hgicId} ${isOrNot} significantly correlated with ${d.key}, with an odds ratio of ${d.value.mean} and an adjusted p-value of ${d.value.pval_adj}.`;
        this.tooltip.transition()
            .duration(200)
            .text(tooltip)
            .style('opacity', 1)
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 28) + 'px');
    }

    hideTooltip(d) {
        this.tooltip.transition()
            .duration(500)
            .style('opacity', 0);
    }

    // Helper functions for testing
    getRawData() {
        return this.rawData;
    }

    getChartData() {
        return this.chartData;
    }

    getLabel() {
        return this.label;
    }

}
