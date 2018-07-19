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
        // console.log(this.geneinfo); // medianlogcpm: 5.6357, tissue: "DLPFC"
        if (!this.geneinfo) {
            return;
        }
        this.ndx = crossfilter(this.geneinfo.medianexpression);
        this.group = this.ndx.groupAll();
        this.dimension = this.ndx.dimension( (d) =>  d.tissue );
        this.tissuecoresGroup = this.dimension.group().reduceSum((d) =>
        d.medianlogcpm); // > 0 ? d.medianlogcpm : 0);
    }

    ngAfterViewInit() {
        const width = this.medianChart.nativeElement.parentElement.offsetWidth;
        this.barchart = dc.barChart(this.medianChart.nativeElement)
            .yAxisLabel('LOG CPM');
        this.barchart.margins().top = 50;
        this.barchart
            .width(width)
            .height(320)
            .gap(50)
            .renderLabel(true)
            .elasticY(false)
            .dimension(this.dimension)
            .group(this.tissuecoresGroup)
            .x(d3.scaleBand())
            .y(d3.scaleLinear().domain([0, this.tissuecoresGroup.top(1)[0].value]))
            .brushOn(false)
            .xUnits(dc.units.ordinal)
            .colors(['#5171C0'])
            // .yAxis().ticks(6)
            .on('renderlet', (chart) => {
                chart.selectAll('rect').on('click', (d) => {
                    console.log('click!', d);
                });
                const yDomainLength = Math.abs(this.barchart.y().domain()[1]
                - this.barchart.y().domain()[0]);
                // if (chart.select('rect').attr('y') === '240' ) {
                //     chart.select('rect').attr('y', 290 );
                // }
                chart.selectAll('rect').each((el, i, tree) => {
                    if (el && el.y <= 0) {
                        tree[i].setAttribute('height', 0);
                    }
                 });
                chart.selectAll('text').each((el, i, tree) => {
                    if (el && el['data'] && el['data'].value < 0) {
                        el['data'].value = '';
                        el.y = '';
                        tree[i].innerHTML = '';
                    }
                });
                // const svgEl = (chart.selectAll('g.axis.y').node() as SVGGraphicsElement);
                const mult = 240 / yDomainLength;
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
            });
        this.barchart.render();
    }

    onResize(event) {
        const width = this.medianChart.nativeElement.parentElement.offsetWidth;
        this.barchart
            .width(width)
            .height(320)
            .x(d3.scaleBand())
            .renderLabel(true)
            .xUnits(dc.units.ordinal)
            .gap(50)
            .redraw();
    }

}
