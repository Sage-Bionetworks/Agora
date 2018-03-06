import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';

import {
    Router,
    ActivatedRoute
} from '@angular/router';

import * as crossfilter from 'crossfilter2';
import * as d3 from 'd3';
import * as dc from 'dc';

@Component({
    selector: 'scatter-plot',
    templateUrl: './scatter-plot-view.component.html',
    styleUrls: [ './scatter-plot-view.component.scss' ]
})
export class ScatterPlotViewComponent implements OnInit {
    @ViewChild('test') chart: ElementRef;
    @Input() title: string;

    constructor(
        private router : Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        let self = this;
        let chart = dc.scatterPlot(this.chart.nativeElement);
        d3.csv('assets/data/geneSampleData.csv', function(error, data) {
            data.forEach(function(x) {
                x['adj.P.Val'] = -Math.log10(+x['adj.P.Val']);
                console.log(x['adj.P.Val']);
                x['logFC'] = +x['logFC'];
            });
            let ndx = crossfilter(data);
            let dim = ndx.dimension(function(d) { return [+d['logFC'], +d['adj.P.Val']] });
            let group = dim.group();
            chart
                //.width(768)
                //.height(480)
                .x(d3.scale.linear().domain([-2,2]))
                .y(d3.scale.linear().domain([0,20]))
                .brushOn(false)
                .clipPadding(10)
                .xAxisLabel("Log Fold Change")
                .yAxisLabel("-log10(Adjusted p-value)")
                .dimension(dim)
                .group(group);
            chart.render();
        });
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets], {relativeTo: this.route}) : this.router.navigate([path], {relativeTo: this.route});
    }
}
