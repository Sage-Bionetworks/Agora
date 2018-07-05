import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';

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
    colors: string[] = [
        '#7692D9', '#699FD2', '#5CADCA', '#42C7BB', '#9FC995', '#CECA82', '#FCCB6F'
    ];

    constructor(
        private dataService: DataService,
        private geneService: GeneService,
        private chartService: ChartService
    ) {}

    ngOnInit() {
        console.log(this.geneinfo); // medianlogcpm: 5.6357, tissue: "DLPFC"
        this.ndx = crossfilter(this.geneinfo.medianexpression);
        this.group = this.ndx.groupAll();
        this.dimension = this.ndx.dimension( (d) =>  d.tissue );
        this.tissuecoresGroup = this.dimension.group().reduceSum((d) => d.medianlogcpm);
    }

    ngAfterViewInit() {
        const width = this.medianChart.nativeElement.parentElement.offsetWidth;
        this.barchart = dc.barChart(this.medianChart.nativeElement)
            .xAxisLabel('Tissue')
            .yAxisLabel('LOG CPM');
        this.barchart
            .width(width)
            .height(620)
            .gap(50)
            .dimension(this.dimension)
            .group(this.tissuecoresGroup)
            .elasticY(true)
            .x(d3.scaleBand())
            .xUnits(dc.units.ordinal)
            .colors(['#E0585D', '#F89C55', '#FCCB6F'])
            .ordinalColors(['#E0585D', '#F89C55', '#FCCB6F'])
            .yAxis().ticks(5);
        dc.renderAll();
    }

}
