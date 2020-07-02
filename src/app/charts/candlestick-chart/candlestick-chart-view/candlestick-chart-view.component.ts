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

    @Input() title: string;
    @Input() chart: any;
    @Input() info: any;
    @Input() label: string = 'candlestick-plot';
    @Input() rawData: any;
    @Input() group: any;
    @Input() paddingLR: number = 15;
    @Input() paddingUD: number = 0;

    @ViewChild('chart', {static: false}) candleStickChart: ElementRef;

    private chartData: any[] = [];
    private maxValue: number = -Infinity;
    private minValue: number = Infinity;
    private chartHeight: number = 500;

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
    }

    ngOnDestroy() {
        d3.select(window).on('resize.' + this.label, null);
    }

    ngAfterViewInit() {
        this.formatData();
        this.initChart();
    }

    getContainerWidth() {
        return this.chart.parentNode.offsetWidth;
    }

    resizeChart() {
        const width = this.chart.parentNode.offsetWidth;
        d3.select(this.chart)
            .attr('width', width);
    }

    initChart() {
        this.getChartPromise().then(() => {
        });
    }

    formatData() {
        this.rawData.forEach(item => {
            const data = {
                key: item.neuropath_type,
                value: {
                    min: item.ci_lower,
                    max: item.ci_upper,
                    mean: item.oddsratio
                }
            }
            if (this.maxValue < item.ci_upper) {
                this.maxValue = item.ci_upper;
            }
            if (this.minValue > item.ci_lower) {
                this.minValue = item.ci_lower;
            }
            this.chartData.push(data);
        })
    }

    getChartPromise(): Promise<any> {
        this.formatData();

        return new Promise((resolve, reject) => {

            const svg = d3.select(this.candleStickChart.nativeElement)
                .append("svg");

            this.chart = svg.node();

            const container = { width: this.getContainerWidth(), height: this.chartHeight };
            const margin = { top: 50, right: 0, bottom: 50, left: 200 };
            const width = container.width - margin.left - margin.right;
            const height = container.height - margin.top - margin.bottom;
            const color = "#5171C0";

            const resize = () => {
                // TODO
            }

            svg.attr("width", container.width)
                .attr("height", container.height)
                .attr("viewBox", `0 0 ${container.width} ${container.height}`)
                // .attr('preserveAspectRatio', 'xMinYMid meet')
                .call(resize)


            const group = svg.append("g")
                .attr("transform", `translate(${margin.left}, 0)`);

            // Draw X axis
            const x = d3.scaleBand()
                .range([0, width])
                .domain(this.chartData.map(item => {
                    return item.key
                }))
                .paddingInner(1)
                .paddingOuter(.5);

            group.append("g")
                .attr("transform", "translate(0," + height + ")")
                .attr("class", "axis x-axis")
                .call(d3.axisBottom(x));

            // Draw X axis title
            group.append("text")
                .attr("transform",
                    "translate(" + (width/2) + " ," +
                    (height + margin.top) + ")")
                .style("text-anchor", "middle")
                .style("font-weight", "bold")
                .text("PHENOTYPE");

            // Draw Y axis
            const y = d3.scaleLinear()
                .domain([this.minValue, this.maxValue])
                .range([height, 0]);

            group.append("g")
                .attr("class", "axis y-axis")
                .call(d3.axisLeft(y));

            // Draw Y axis title
            group.append("text")
                .attr("transform", `rotate(-90) translate(${-height/2}, ${-margin.left/2})`)
                .style("text-anchor", "middle")
                .style("font-weight", "bold")
                .text("ODDS RATIO")

            // Draw vertical lines
            group.selectAll("vertLines")
                .data(this.chartData)
                .enter()
                .append("line")
                .attr("x1", d => x(d.key))
                .attr("x2", d => x(d.key))
                .attr("y1", d => y(d.value.min))
                .attr("y2", d => y(d.value.max))
                .attr("stroke", color)
                .attr("stroke-width", 1.5)

            // Draw mid circle (mean value)
            group.selectAll("meanCircle")
                .data(this.chartData)
                .enter()
                .append("circle")
                .attr("cx", d => x(d.key))
                .attr("cy", d => y(d.value.mean))
                .attr("r", 9)
                .attr("stroke", color)
                .style("fill", color);

            d3.select(window).on('resize.' + this.label, resize);
            resolve();

        })
    }


}
