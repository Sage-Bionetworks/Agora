import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    Input,
    AfterViewInit
} from '@angular/core';

import { DataService } from '../../../core/services';

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
    @Input() paddingLR: number = 15;
    @Input() paddingUD: number = 0;

    barchart: any;
    ndx: any;
    group: any;
    dimension: any;
    tissuecoresGroup: any;

    private resizeTimer;

    constructor(
        private dataService: DataService
    ) {}

    ngOnInit() {
        if (!this.geneinfo) {
            return;
        }
        this.ndx = crossfilter(this.geneinfo.medianexpression);
        this.group = this.ndx.groupAll();
        this.dimension = this.ndx.dimension( (d) =>  d.tissue );
        this.tissuecoresGroup = this.dimension.group().reduceSum((d) =>
            d.medianlogcpm
        );
    }

    ngAfterViewInit() {
        const self = this;
        this.barchart = dc.barChart(this.medianChart.nativeElement)
            .yAxisLabel('LOG CPM', 20);
        this.barchart.margins().top = 50;
        this.barchart.margins().left = 70;
        this.barchart.margins().right = 0;
        this.barchart
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
            .xUnits(dc.units.ordinal)
            .colors(['#5171C0'])
            .on('renderlet', (chart) => {
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
            });

        this.barchart.yAxis().ticks(3);
        this.barchart.render();
    }

    onResize(event?: any) {
        const self = this;

        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            self.barchart
                .width(
                    self.medianChart.nativeElement.parentElement.offsetWidth - (self.paddingLR * 2)
                )
                .height(self.medianChart.nativeElement.offsetHeight - (self.paddingUD * 2));

            if (self.barchart.rescale) {
                self.barchart.rescale();
            }

            // Run code here, resizing has "stopped"
            self.barchart.redraw();
        }, 100);
    }

}
