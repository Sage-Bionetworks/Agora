import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input, ContentChild, AfterContentInit } from '@angular/core';

import {
    ActivatedRoute
} from '@angular/router';

import { Gene } from '../../../models';

import {
    ChartService,
    ColorService
} from '../../../core/services';

import * as d3 from 'd3';
import * as dc from 'dc';

@Component({
    selector: 'scatter-plot',
    templateUrl: './scatter-plot-view.component.html',
    styleUrls: [ './scatter-plot-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class ScatterPlotViewComponent implements OnInit, AfterContentInit {
    @Input() title: string;
    @Input() chart: any;
    @Input() info: any;
    @Input() label: string;

    @ViewChild('chart') scatterPlot: ElementRef;

    constructor(
        private route: ActivatedRoute,
        private chartService: ChartService,
        private colorService: ColorService
    ) { }

    ngOnInit() {}

    ngAfterContentInit() {
        if (!this.label) {
            this.route.params.subscribe(params => {
                this.label = params['label'];
                this.initChart();
            });
        } else {
            this.initChart();
        }
    }

    initChart() {
        let self = this;
        this.info = this.chartService.getChartInfo(this.label)
        this.title = this.info.title;
        this.chart = dc.scatterPlot(this.scatterPlot.nativeElement)
            .height(this.scatterPlot.nativeElement.offsetHeight)
            .x(this.info.x)
            .brushOn(false)
            .xAxisLabel(this.info.xAxisLabel)
            .yAxisLabel(this.info.yAxisLabel)
            .dimension(this.chartService.getDimension(this.label))
            .group(this.chartService.getGroup(this.label))
            .colors(['#B54F12', '#B95712', '#BD5F12', '#C26712', '#C66F12', '#CB7713', '#CF7F13', '#D38713', '#D88F13', '#DC9713', '#E1A014'])
            .colorAccessor(function(d) {
                return Number.isNaN(+d.key[0]) ? 0 : d.key[0];
            });


        if (this.info.xUnits) this.chart.xUnits(this.info.xUnits);
        if (this.info.y) this.chart.y(this.info.y);

        this.chart.render();
    }

    getValue (d: any) {
        let value: number
        if (!(isNaN(d.value))) {
            value = d.value;
        } else if (!d.value) {
            value = 0;
        }

        return value;
    }
}
