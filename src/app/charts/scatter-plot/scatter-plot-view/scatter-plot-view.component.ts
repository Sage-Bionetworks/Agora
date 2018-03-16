import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input, ContentChild, AfterContentInit } from '@angular/core';

import {
    ActivatedRoute
} from '@angular/router';

import { Gene } from '../../../models';

import {
    ChartService,
    ColorService
} from '../../../core/services';

import { GeneService } from '../../../core/services';

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

    private dim: CrossFilter.Dimension<any, any>;
    private group: CrossFilter.Group<any, any, any>;

    constructor(
        private route: ActivatedRoute,
        private chartService: ChartService,
        private colorService: ColorService,
        private geneService: GeneService
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

        // Init the chart variables
        this.dim = this.chartService.getDimension(this.label);
        this.group = this.chartService.getGroup(this.label);

        this.chart = dc.scatterPlot(this.scatterPlot.nativeElement)
            .x(d3.scale.linear().domain([this.geneService.minLogFC, this.geneService.maxLogFC]))
            .y(d3.scale.linear().domain([0, this.geneService.maxAdjPVal]))
            .brushOn(false)
            .xAxisLabel(this.info.xAxisLabel)
            .yAxisLabel(this.info.yAxisLabel)
            .dimension(this.dim)
            .group(this.group)
            //.linearColors(['#b30000', '#fdd49e'])
            .linearColors(['#000000', '#bbbbbb'])
            .colorAccessor(function(d) {
                if (Number.isNaN(+d.key[0]) || Number.isNaN(+d.key[1])) return 0;
                let a = 0 - +d.key[0];
                let b = 0 - +d.key[1];
                //return  Math.sqrt(a*a + (b*b));
                return  Math.abs(a);
            });


        if (this.info.xUnits) this.chart.xUnits(this.info.xUnits);

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
