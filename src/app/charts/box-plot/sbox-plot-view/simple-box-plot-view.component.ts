import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    Input,
    OnDestroy
} from '@angular/core';

import { PlatformLocation } from '@angular/common';

import { Router, NavigationStart } from '@angular/router';

import { ChartService } from '../../services';
import { GeneService, ApiService } from '../../../core/services';

import { Proteomics, Metabolomics } from 'app/models';

import { Subscription } from 'rxjs';

import * as d3 from 'd3';
import * as dc from 'dc';

@Component({
    selector: 'sbox-plot',
    templateUrl: './simple-box-plot-view.component.html',
    styleUrls: [ './simple-box-plot-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class SBoxPlotViewComponent implements OnInit, OnDestroy {
    @ViewChild('chart', {static: false}) boxPlot: ElementRef;
    @ViewChild('bpcol', {static: false}) bpCol: ElementRef;
    @Input() paddingLR: number = 15;
    @Input() paddingUD: number = 0;
    @Input() title: string;
    @Input() chart: any;
    @Input() info: any;
    @Input() label: string = 'sbox-plot';
    @Input() dim: any;
    @Input() group: any;
    @Input() rcBigRadius: number = 12.5;
    @Input() rcSmallRadius: number = 9;
    @Input() rcRadius: number = 12.5;
    @Input() boxRadius: number = 9;
    @Input() metabolomics: Metabolomics;

    display: boolean = false;
    counter: number = 0;
    routerSubscription: Subscription;

    private resizeTimer;

    constructor(
        private location: PlatformLocation,
        private router: Router,
        private geneService: GeneService,
        private chartService: ChartService
    ) { }

    ngOnInit() {
        // If we move away from the overview page, remove
        // the charts
        this.routerSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.removeSelf();
            }
        });
        this.location.onPopState(() => {
            this.removeSelf();
        });

        this.initChart();
    }

    removeSelf() {
        this.display = false;
        this.removeChart();
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
        this.geneService.setEmptyGeneState(true);
    }

    removeChart() {
        if (this.chart) {
            this.chartService.removeChart(this.chart, this.chart.group(), this.chart.dimension());
            this.chart = null;
            this.geneService.setPreviousGene(this.geneService.getCurrentGene());
        }
    }

    ngOnDestroy() {
        this.chartService.removeChart(this.chart);
    }

    initChart() {
        const bpDim = {
            filter: () => {
                //
            },
            filterAll: () => {
                //
            }
        };
        this.dim = bpDim;

        this.getChartPromise().then((chart: any) => {
            this.chart = chart;

            chart.yAxis().tickFormat(d3.format('.1e'));

            // Remove filtering for this chart
            chart.filter = function() {
                //
            };
            chart.margins({
                left: 90,
                right: 30,
                bottom: 50,
                top: 10
            });

            chart.render();
        });
    }

    getChartPromise(): Promise<dc.BoxPlot> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.updateChartGroup(self.metabolomics);

            const chartInst = dc.boxPlot(this.boxPlot.nativeElement)
                .dimension(this.dim)
                .yAxisLabel(self.metabolomics['metabolite.full.name'] + ' levels', 20)
                .group(this.group)
                .renderTitle(true)
                ['showOutliers'](false)
                .dataWidthPortion(0.1)
                .dataOpacity(0)
                .colors('transparent')
                .tickFormat(() => '')
                .elasticX(true)
                .elasticY(true)
                .yRangePadding(this.rcRadius * 1.5)
                .on('renderlet', function(chart) {
                    dc.events.trigger(function() {
                        chart.selectAll('rect.box')
                            .attr('rx', self.boxRadius);
                    });
                });

            resolve(chartInst);
        });
    }

    updateChartGroup(metabolomics: Metabolomics) {
        const valuesArray: any[] = [];
        metabolomics['transposed.boxplot.stats'].forEach((bps, index) => {
            valuesArray.push({
                key: metabolomics['boxplot.boxplot.group.names'][index],
                value: bps
            });
        });

        this.group = {
            all() {
                return valuesArray;
            },
            order() {
                //
            },
            top() {
                //
            }
        };
    }

    onResize(event?: any) {
        const self = this;

        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(function() {
            self.chart
                .width(self.boxPlot.nativeElement.offsetWidth)
                .height(self.boxPlot.nativeElement.offsetHeight);

            if (self.chart.rescale) {
                self.chart.rescale();
            }

            // Run code here, resizing has "stopped"
            self.chart.redraw();
        }, 100);
    }
}
