import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';

import {
    ActivatedRoute
} from '@angular/router';

import { Gene } from '../../../models';

import {
    ChartService,
    GeneService
} from '../../../core/services';

import * as d3 from 'd3';
import * as dc from 'dc';

// Using a d3 v4 function to get all node
d3.selection.prototype['nodes'] = function(){
    var nodes = new Array(this.size()), i = -1;
    this.each(function() { nodes[++i] = this; });
    return nodes;
}

@Component({
    selector: 'row-chart',
    templateUrl: './row-chart-view.component.html',
    styleUrls: [ './row-chart-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class RowChartViewComponent implements OnInit {
    @Input() title: string;
    @Input() chart: any;
    @Input() info: any;
    @Input() label: string;

    @ViewChild('chart') rowChart: ElementRef;
    @ViewChild('studies') stdCol: ElementRef;

    changedLabels: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private geneService: GeneService,
        private chartService: ChartService
    ) { }

    ngOnInit() {
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
        this.chart = dc.rowChart(this.rowChart.nativeElement)
            .x(d3.scale.linear().domain([this.geneService.ci_L, this.geneService.ci_R]))
            .elasticX(true)
            .gap(4)
            .title(function(d) {
                return d.value.logFC || 0;
            })
            .valueAccessor(function(d) {
                return d.value.logFC || 0;
            })
            .label(function (d) {
                return d.key;
            })
            .othersGrouper(null)
            .ordinalColors(['#fdae6b','#fd8d3c','#f16913','#d94801','#a63603','#7f2704'])
            .dimension(this.chartService.getDimension(this.label))
            .group(this.chartService.getGroup(this.label));

        this.chart.xAxis().ticks(5);

        this.chart.on('filtered', function(chart, filter){
            console.log(chart, filter);
        });

        this.chart.on('renderlet', function (chart) {
            let barHeight = chart.select('g.row rect').attr('height');
            let newSvg = d3.select(self.stdCol.nativeElement).append('svg');
            let textGroup = newSvg.append('g')
                .attr('class', 'textGroup');

            let allText = chart.selectAll('g.row text');
            let removed = allText.remove();

            // Copy the texts to another div, so they show up
            if (!self.changedLabels) {
                let stdColHeight = chart.height();
                let step = chart.select('g.axis g.tick line.grid-line').node().getBBox().height / (removed.nodes().length);
                removed.nodes().forEach(n => {
                    textGroup.append(function() {
                        return n;
                    })
                })
                d3.select(self.stdCol.nativeElement).selectAll('g.textGroup text').each(function(d, i) {
                    let currentStep = step * i;
                    // your update code here as it was in your example
                    d3.select(this).attr('transform', function () {
                        return 'translate(0,' + (currentStep+5) + ')';
                    });
                });

                // Draw the lines through the squares
                let bar = chart.selectAll('g.row')
                    .insert('g', ':first-child')
                    .attr('class', 'hline');
                bar
                    .insert('line')
                    .attr({
                        'stroke-width': 1.5,
                        stroke: 'wheat',
                        x1: function(d) {
                            return chart.x()(d.value.logFC) - 30;
                        },
                        y1: function(d) {
                            return barHeight/2;
                        },
                        x2: function(d) {
                            return chart.x()(d.value.logFC) + 40;
                        },
                        y2: function(d) {
                            return barHeight/2;
                        }
                    });

                self.changedLabels = true;
            }

            // Change the rectangles to small ones
            chart
                .selectAll('g.row rect')
                .attr('transform', function(d) {
                    return 'translate(' + chart.x()(d.value.logFC) + ',' + ((barHeight/2)-5) + ')';
                })
                .attr('width', '10')
                .attr('height', '10');
        });

        this.chart.render();
    }
}
