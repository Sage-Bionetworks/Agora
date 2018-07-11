import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    Input,
    AfterViewInit } from '@angular/core';

import { ChartService } from '../../services';
import { DataService, GeneService } from '../../../core/services';

import * as d3 from 'd3';
import * as dc from 'dc';

import * as crossfilter from 'crossfilter2';

@Component({
    selector: 'median-chart',
    templateUrl: './median-chart-view.component.html',
    styleUrls: ['./median-chart-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MedianChartViewComponent implements OnInit, AfterViewInit {
    @Input() geneinfo: any;
    @ViewChild('barchart') medianChart: ElementRef;

    barchart: any;
    ndx: any;
    group: any;
    dimension: any;
    tissuecoresGroup: any;

    constructor(
        private dataService: DataService,
        private geneService: GeneService,
        private chartService: ChartService
    ) {}

    ngOnInit() {
        console.log(this.geneinfo); // medianlogcpm: 5.6357, tissue: "DLPFC"
        if (!this.geneinfo) {
            return;
        }
        this.ndx = crossfilter(this.geneinfo.medianexpression);
        this.group = this.ndx.groupAll();
        this.dimension = this.ndx.dimension( (d) =>  d.tissue );
        this.tissuecoresGroup = this.dimension.group().reduceSum((d) => d.medianlogcpm);
    }

    ngAfterViewInit() {
        const width = this.medianChart.nativeElement.parentElement.offsetWidth;
        this.barchart = dc.barChart(this.medianChart.nativeElement)
            .yAxisLabel('LOG CPM');
        this.barchart.margins().top = 50;
        this.barchart
            .width(width)
            .height(620)
            .gap(50)
            .brushOn(false)
            .renderLabel(true)
            .dimension(this.dimension)
            .group(this.tissuecoresGroup)
            .elasticY(true)
            .x(d3.scaleBand())
            .xUnits(dc.units.ordinal)
            .colors(['#5171C0'])
            // .yAxis().ticks(6)
            .on('renderlet', (chart) => {
                chart.selectAll('rect').on('click', (d) => {
                    console.log('click!', d);
                });
                const lefty = 10;
                const righty = 70; // use real statistics here!
                const extradata = [{ x: chart.x().range()[0], y: chart.y()(lefty) },
                { x: chart.x().range()[1], y: chart.y()(righty) }];
                const line = d3.line()
                    .x((d: any) =>  d.x)
                    .y((d: any) => d.y)
                    .curve(d3.curveLinear);
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
            });
        this.barchart.render();
    }

    onResize(event) {
        const width = this.medianChart.nativeElement.parentElement.offsetWidth;
        this.barchart
            .width(width)
            .height(620)
            .x(d3.scaleBand())
            .renderLabel(true)
            .xUnits(dc.units.ordinal)
            .gap(50)
            .redraw();
    }

}
