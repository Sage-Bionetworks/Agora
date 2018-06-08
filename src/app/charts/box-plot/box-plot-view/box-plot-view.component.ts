import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    Input
} from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Gene } from '../../../models';

import { ChartService } from '../../services';
import { DataService, GeneService } from '../../../core/services';

import * as d3 from 'd3';
import * as dc from 'dc';

@Component({
    selector: 'box-plot',
    templateUrl: './box-plot-view.component.html',
    styleUrls: [ './box-plot-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class BoxPlotViewComponent implements OnInit {
    @Input() title: string;
    @Input() chart: any;
    @Input() info: any;
    @Input() label: string = '';
    @Input() currentGene = this.geneService.getCurrentGene();
    @Input() dim: any;
    @Input() group: any;

    @ViewChild('chart') boxPlot: ElementRef;

    changedLabels: boolean = false;
    display: boolean = false;
    counter: number = 0;
    geneEntries: Gene[] = [];

    private resizeTimer;

    constructor(
        private dataService: DataService,
        private geneService: GeneService,
        private chartService: ChartService,
        private decimalPipe: DecimalPipe
    ) { }

    ngOnInit() {
        this.initChart();
    }

    initChart() {
        const self = this;
        this.geneEntries = this.dataService.getGeneEntries();
        if (!this.info) {
            this.info = this.chartService.getChartInfo(this.label);
        }
        this.dim = this.dataService.getDimension(
            this.info,
            this.currentGene
        );
        this.group = this.dataService.getGroup(this.info);

        this.chart = dc.boxPlot(this.boxPlot.nativeElement);
        this.chart
            .title((d) => {
                return d.value;
            })
            .dimension(this.dim)
            .group(this.group)
            .renderDataPoints(true)
            .renderTitle(true)
            .elasticX(true)
            .elasticY(true)
            .boldOutlier(true)
            .yAxisLabel(this.info.yAxisLabel)
            .dataWidthPortion(1)
            .boldOutlier(true)
            .colors('black')
            .transitionDuration(0);

        this.chart.tickFormat(d3.format('.5f'));

        this.registerChartEvent(this.chart, 'postRedraw');
        this.registerChartEvent(this.chart, 'postRender');

        this.chart.render();
    }

    // A custom renderlet function for this chart, allows us to change
    // what happens to the chart after rendering
    registerChartEvent(chartEl: dc.BoxPlot, type: string = 'renderlet') {
        const self = this;
        // Using a different name for the chart variable here so it's not shadowed
        chartEl.on(type, function(chart) {
            chart.selectAll('rect.box')
                .append('title')
                .text(function(d) {
                    return 'src: log2(fold change)';
                });

            const lineCenter = chart.selectAll('line.center');
            const allCircles = chart.selectAll('circle')
                .attr('cx', lineCenter.attr('x1'));

            const filteredGenes = self.geneEntries.slice().filter((g) => {
                /*return g.tissue_study_pretty === self.geneService.getCurrentTissue() &&
                    g.comparison_model_sex_pretty === self.geneService.getCurrentModel() &&
                    g.hgnc_symbol === self.geneService.getCurrentGene().hgnc_symbol;*/
                return g.hgnc_symbol === self.geneService.getCurrentGene().hgnc_symbol;
            });
            let found = false;
            let foundIndex = -1;
            const foundCircles = chart.selectAll('circle')
                .filter((c, i) => {
                    const cfound = filteredGenes.some((g) => {
                        return (chart.group().all()[0].value[i] || !cfound) ?
                            chart.group().all()[0].value[i] === g[self.info.attr] :
                            false;
                    });
                    if (cfound) {
                        found = cfound;
                        foundIndex = i;
                    }
                    return cfound;
                })
                .style('fill', '#FCA79A')
                .style('stroke', '#F47E6C')
                .style('stroke-width', 3)
                .style('r', 13.6)
                .style('opacity', 1);

            const notFoundCircles = chart.selectAll('circle')
                .filter((c, i) => {
                    return i !== foundIndex;
                })
                .style('fill', '#8D919E')
                .style('stroke', 'none')
                .style('r', 4.6);

            // Move the red circles to front
            foundCircles.each(function() {
                this.parentNode.appendChild(this);
            });
        });
    }

    onResize(event) {
        const self = this;

        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(function() {
            self.chart
                .width(self.boxPlot.nativeElement.parentElement.offsetWidth)
                .height(self.boxPlot.nativeElement.offsetHeight);

            if (self.chart.rescale) {
                self.chart.rescale();
            }

            // Run code here, resizing has "stopped"
            self.chart.redraw();
        }, 100);
    }
}
