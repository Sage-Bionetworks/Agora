import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    Input,
    OnDestroy
} from '@angular/core';

import { Router, NavigationStart } from '@angular/router';

import { PlatformLocation } from '@angular/common';

import { ChartService } from '../../services';
import { DataService, GeneService } from '../../../core/services';

import * as d3 from 'd3';
import * as dc from 'dc';
import '../../../../scripts/dc-canvas-scatterplot.js';

@Component({
    selector: 'scatter-plot',
    templateUrl: './scatter-plot-view.component.html',
    styleUrls: [ './scatter-plot-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class ScatterPlotViewComponent implements OnInit, OnDestroy {
    @Input() title: string;
    @Input() chart: any;
    @Input() info: any;
    @Input() label: string = 'volcano-plot';
    @Input() currentGene = this.geneService.getCurrentGene();
    @Input() dim: any;
    @Input() group: any;

    @ViewChild('chart') scatterPlot: ElementRef;

    constructor(
        private location: PlatformLocation,
        private router: Router,
        private chartService: ChartService,
        private dataService: DataService,
        private geneService: GeneService,
    ) { }

    ngOnInit() {
        // If we move aways from the overview page, remove
        // the charts
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                if (this.chart && dc.hasChart(this.chart)) {
                    this.chartService.removeChart(
                        this.chart, this.chart.group(),
                        this.chart.dimension()
                    );
                    this.chart = null;
                    this.geneService.setPreviousGene(this.geneService.getCurrentGene());
                }
            }
        });
        this.location.onPopState(() => {
            if (this.chart && dc.hasChart(this.chart)) {
                this.chartService.removeChart(
                    this.chart, this.chart.group(),
                    this.chart.dimension()
                );
                this.chart = null;
                this.geneService.setPreviousGene(this.geneService.getCurrentGene());
            }
        });

        this.initChart();
    }

    ngOnDestroy() {
        this.chartService.removeChart(this.chart);
    }

    initChart() {
        const self = this;
        this.info = this.chartService.getChartInfo(this.label);
        this.dim = this.dataService.getDimension(this.info);
        this.group = this.dataService.getGroup(this.info);
        this.title = this.info.title;

        const logDomain = this.geneService.getAdjPValue();
        this.chart = dc.scatterPlot(this.scatterPlot.nativeElement);
        this.chart
            .useCanvas(true)
            .x(d3.scaleLinear().domain(this.geneService.getLogFC()))
            .y(d3.scaleLog().domain([logDomain[0], +logDomain[1]]))
            .xAxisLabel(this.info.xAxisLabel)
            .yAxisLabel(this.info.yAxisLabel)
            .title((p) => {
                return null;
            }) // Disable tooltips
            .renderTitle(false)
            .brushOn(false)
            .mouseZoomable(true)
            .zoomOutRestrict(false)
            .dimension(this.dim)
            .group(this.group)
            .keyAccessor((d) => {
                return d.key[0];
            })
            .valueAccessor((d) => {
                return d.key[1];
            })
            .colors(d3.scaleOrdinal().domain(['yes', 'no']).range(['red', 'black']))
            .colorAccessor((d) => {
                if (d.key[2] === self.currentGene.hgnc_symbol) {
                    return 'yes';
                } else {
                    return 'no';
                }
            })
            .on('preRender', (chart) => {
                chart.rescale();
            })
            .on('preRedraw', (chart) => {
                chart.rescale();
            });

        this.chart.render();
    }
}
