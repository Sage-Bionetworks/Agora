import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Gene } from '../../../models';

import { ChartService } from '../../services';
import { DataService, GeneService } from '../../../core/services';

import * as d3 from 'd3';
import * as dc from 'dc';

// Using a d3 v4 function to get all nodes
d3.selection.prototype['nodes'] = function() {
    const nodes = new Array(this.size());
    let i = -1;
    this.each(function() { nodes[++i] = this; });
    return nodes;
};

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
    @Input() label: string = 'forest-plot';
    @Input() currentGene = this.geneService.getCurrentGene();
    @Input() filterTissues = this.geneService.getTissues();
    @Input() filterModels = this.geneService.getModels();
    @Input() dim: any;
    @Input() group: any;

    @ViewChild('chart') rowChart: ElementRef;
    @ViewChild('studies') stdCol: ElementRef;

    changedLabels: boolean = false;
    display: boolean = false;

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
        this.info = this.chartService.getChartInfo(this.label);
        this.dim = this.dataService.getDimension(
            this.label,
            this.info,
            this.currentGene,
            this.filterTissues,
            this.filterModels
        );
        this.group = this.dataService.getGroup(this.label, this.info);

        this.title = this.info.title;
        this.chart = dc.rowChart(this.rowChart.nativeElement)
            .x(d3.scaleLinear().domain(this.geneService.getLogFC()))
            .elasticX(true)
            .gap(4)
            .title(function(d) {
                return 'Log Fold Change: ' + (self.decimalPipe.transform(+d.value.logfc) || 0);
            })
            .valueAccessor((d) => {
                return +(self.decimalPipe.transform(+d.value.logfc || 0));
            })
            .label((d) => {
                return d.key;
            })
            .othersGrouper(null)
            .ordinalColors(['#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'])
            .dimension(this.dim)
            .group(this.group)
            .transitionDuration(0);

        // Add this number of ticks so the x axis don't get cluttered with text
        this.chart.xAxis().ticks(5);

        // Register the row chart renderlet
        this.registerChartEvent(this.chart);

        this.chart.render();
    }

    // A custom renderlet function for this chart, allows us to change
    // what happens to the chart after rendering
    registerChartEvent(chartEl: dc.RowChart, type: string = 'renderlet') {
        const self = this;
        // Using a different name for the chart variable here so it's nor shadowed
        chartEl.on(type, function(chart) {
            const rectHeight = parseInt(chart.select('g.row rect').attr('height'), 10);
            const squareSize = 10;
            const lineWidth = 60;

            // Test if we should display the chart. Using this variable so we don't see
            // the rows rectangles change into small squares abruptly
            if (!self.display) {
                // Copy all vertical texts to another div, so they don't get hidden by
                // the row chart svg after being translated
                self.moveTextToElement(chart, self.stdCol.nativeElement, squareSize / 2);

                // Insert a line for each row of the chart
                self.insertLinesInRows(chart);

                // Draw the inserted lines in each row
                self.drawLines(chart, rectHeight / 2, lineWidth);
            } else {
                // This part will be called on redraw after filtering, so at this point
                // we just need to move the lines to the correct position again. First
                // translate the parent element
                const hlines = chart.selectAll('g.row g.hline');
                hlines.each(function(p, i) {
                    d3.select(this).attr('transform', function(d: any) {
                        return 'translate(' + d.value.logfc + ')';
                    });
                });

                // Finally redraw the lines in each row
                self.drawLines(chart, rectHeight / 2, lineWidth);
            }

            // Change the row rectangles into small squares, this happens on
            // every render or redraw
            self.rectToSquares(chart, squareSize, rectHeight);

            // Finally show the chart
            self.display = true;
        });
    }

    // Moves all text in textGroups to a new HTML element
    moveTextToElement(chart: dc.RowChart, el: HTMLElement, vSpacing: number = 0) {
        const newSvg = d3.select(el).append('svg');
        const textGroup = newSvg.append('g').attr('class', 'textGroup');

        // Remove the old texts and append to the new group
        const allText = chart.selectAll('g.row text');
        const removed = allText.remove();
        removed['nodes']().forEach((n) => {
            textGroup.append(function() {
                return n;
            });
        });

        // Move the text to the correct position in the new svg
        const stdColHeight = chart.height();
        const svgEl = (chart.select('g.axis g.tick line.grid-line').node() as SVGGraphicsElement);
        const step = svgEl.getBBox().height / (removed['nodes']().length);

        d3.select(el).selectAll('g.textGroup text').each(function(d, i) {
            const currentStep = step * i;
            d3.select(this).attr('transform', () => {
                return 'translate(0,' + (currentStep + (vSpacing)) + ')';
            } );
        } );
    }

    insertLinesInRows(chart: dc.RowChart) {
        chart.selectAll('g.row')
            .insert('g', ':first-child')
            .attr('class', 'hline')
            .insert('line');
    }

    // Draw the lines through the chart rows
    drawLines(chart: dc.RowChart, yPos: number, lineWidth: number) {
        const lines = chart.selectAll('g.row g.hline line')
            .attr({
                'stroke-width': 1.5,
                'stroke': 'wheat',
                // ES6 method shorthand for object literals
                'x1'(d) {
                    return chart.x()(d.value.logfc) - lineWidth / 2;
                },
                'y1'(d) {
                    return yPos;
                },
                'x2'(d) {
                    return chart.x()(d.value.logfc) + lineWidth / 2;
                },
                'y2'(d) {
                    return yPos;
                }
            });
    }

    // Changes the chart row rects into squares of the square size
    rectToSquares(chart: dc.RowChart, squareSize: number, rectHeight: number) {
        chart
            .selectAll('g.row rect')
            .attr('transform', function(d) {
                return 'translate(' +
                    // X translate
                    (chart.x()(d.value.logfc) - (squareSize / 2)) +
                    ',' +
                    // Y translate
                    ((rectHeight / 2) - (squareSize / 2)) +
                ')';
            })
            .attr('width', squareSize)
            .attr('height', squareSize);
    }

    displayChart() {
        return { opacity: (this.display) ? 1 : 0 };
    }
}
