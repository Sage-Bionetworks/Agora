import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    Input,
    OnDestroy,
    AfterViewInit,
    AfterContentChecked
} from '@angular/core';

import { PlatformLocation } from '@angular/common';

import { Router, NavigationStart } from '@angular/router';

import { ChartService } from '../../services';
import { DataService, GeneService } from '../../../core/services';

import { Subscription } from 'rxjs';

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
export class RowChartViewComponent implements OnInit, OnDestroy, AfterViewInit,
    AfterContentChecked {

    @Input() title: string;
    @Input() chart: any;
    @Input() info: any;
    @Input() label: string = 'forest-plot';
    @Input() currentGene = this.geneService.getCurrentGene();
    @Input() dim: any;
    @Input() group: any;
    @Input() paddingLR: number = 15;
    @Input() paddingUD: number = 0;

    @ViewChild('chart', {static: false}) rowChart: ElementRef;
    @ViewChild('studies', {static: false}) stdCol: ElementRef;

    max: number = -Infinity;
    currentModel: string;
    currentTissue: string;
    display: boolean = false;
    canDisplay: boolean = false;
    canResize: boolean = false;
    firstRender: boolean = true;
    colors: string[] = ['#5171C0'];
    routerSubscription: Subscription;
    chartSubscription: Subscription;

    // Define the div for the tooltip
    div: any = d3.select('body').append('div')
        .attr('class', 'rc-tooltip')
        .style('width', 200)
        .style('height', 160)
        .style('opacity', 0);

    private resizeTimer;

    constructor(
        private location: PlatformLocation,
        private router: Router,
        private dataService: DataService,
        private geneService: GeneService,
        private chartService: ChartService
    ) { }

    ngOnInit() {
        this.currentModel = this.geneService.getDefaultModel();
        this.currentTissue = this.geneService.getDefaultTissue();

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

        this.chartSubscription = this.chartService.chartsReady$.subscribe((state: boolean) => {
            if (state) {
                this.initChart();
            }
        });
    }

    ngAfterViewInit() {
        // Registers this chart
        this.chartService.addChartName(this.label);
    }

    ngAfterContentChecked() {
        this.canResize = true;
    }

    ngOnDestroy() {
        this.chartService.removeChart(this.chart);
    }

    removeSelf() {
        this.canDisplay = false;
        this.removeChart();
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
        if (this.chartSubscription) {
            this.chartSubscription.unsubscribe();
        }
        this.geneService.setEmptyGeneState(true);
        this.firstRender = true;
        this.display = false;
    }

    getModel(): string {
        const model = this.geneService.getCurrentModel();
        return (model) ? model : '';
    }

    initChart() {
        const self = this;
        this.info = this.chartService.getChartInfo(this.label);

        this.dim = {
            filter: () => {
                //
            },
            filterAll: () => {
                //
            }
        };
        this.group = {
            all() {
                return self.chartService.filteredData['fpGroup'].values;
            },
            order() {
                //
            },
            top() {
                //
            }
        };

        this.title = this.info.title;
        this.getChartPromise().then((chart) => {
            // Increase bottom margin by 20 to place a label there, default is 30
            chart.margins({
                left: 20,
                right: 20,
                bottom: 60,
                top: 0
            });

            // Removes the click event for the rowChart to prevent filtering
            chart.onClick = () => {
                //
            };

            chart.render();
            this.chart = chart;
        });
    }

    removeChart() {
        if (this.chart) {
            this.chartService.removeChart(
                this.chart, this.chart.group(),
                this.chart.dimension()
            );
            this.chartService.removeChartName(this.label);
            this.chart = null;
            this.geneService.setPreviousGene(this.geneService.getCurrentGene());
        }
    }

    getChartPromise(): Promise<any> {
        const self = this;
        return new Promise((resolve, reject) => {
            const chartInst = dc.rowChart(self.rowChart.nativeElement)
                .gap(4)
                .title(function(d) {
                    return 'Log Fold Change: ' +
                        self.dataService.getSignificantFigures(+d.value.logfc);
                })
                .valueAccessor((d) => {
                    return self.dataService.getSignificantFigures(+d.value.logfc);
                })
                .keyAccessor((d) => {
                    return d.key[0];
                })
                .label((d) => {
                    return d.key[0];
                })
                .on('preRender', function(chart) {
                    self.max = -Infinity;
                    self.updateXDomain();
                    if (self.max !== -Infinity) {
                        self.max *= 1.1;
                        chart.x(d3.scaleLinear().range([
                            0, (self.rowChart.nativeElement.offsetWidth - 40)
                        ]).domain([
                            -self.max, self.max
                        ]));
                        chart.xAxis().scale(chart.x());
                    }
                })
                .on('preRedraw', function(chart) {
                    self.max = -Infinity;
                    self.updateXDomain();
                    if (self.max !== -Infinity) {
                        self.max *= 1.1;
                        chart.x(d3.scaleLinear().range([
                            0, (self.rowChart.nativeElement.offsetWidth - 40)
                        ]).domain([
                            -self.max, self.max
                        ]));
                        chart.xAxis().scale(chart.x());
                    }
                })
                .on('renderlet', function(chart) {
                    if (self.firstRender) {
                        self.firstRender = false;
                        // Copy all vertical texts to another div, so they don't get hidden by
                        // the row chart svg after being translated
                        self.moveTextToElement(chart, self.stdCol.nativeElement, 9);
                    }
                    dc.events.trigger(function() {
                        const width = self.rowChart.nativeElement.offsetWidth || 450;
                        const height = self.rowChart.nativeElement.offsetHeight || 450;
                        self.updateChartExtras(
                            chart,
                            chart.svg(),
                            width,
                            height
                        );
                        self.chartService.addChartRendered(self.label);
                    });
                })
                .othersGrouper(null)
                .ordinalColors(self.colors)
                .dimension(self.dim)
                .group(self.group)
                .transitionDuration(0);

            resolve(chartInst);
        });
    }

    addXLabel(chart: dc.RowChart, text: string, svg?: any, width?: number, height?: number) {
        const textSelection = (svg || chart.svg());
        if (textSelection !== null) {
            textSelection
                .append('text')
                .attr('class', 'x-axis-label')
                .attr('text-anchor', 'middle')
                .attr('x', width / 2)
                .attr('y', height - 10)
                .text(text);

            this.adjustXLabel(chart, textSelection, width, height);
        }
    }

    adjustXLabel(chart: dc.RowChart, sel: any, width?: number, height?: number) {
        const svgEl = (sel.node() || chart.svg()) as SVGGraphicsElement;
        if (svgEl !== null) {
            const textDims = svgEl.getBBox();

            // Dynamically adjust positioning after reading text dimension from DOM
            // The main svg gets translated by (30, 10) and the flex row has a margin
            // of 15 pixels. We subtract them from the svg size, get the middle point
            // then add back the left translate to get the correct center
            sel
                .attr('x', ((width - 45) / 2) + 30)
                .attr('y', height - Math.ceil(textDims.height) / 2);
        }
    }

    updateChartExtras(chart: dc.RowChart, svg?: any, width?: number, height?: number) {
        const self = this;
        let rectHeight = (!chart.select('g.row rect').empty()) ?
            parseInt(chart.select('g.row rect').attr('height'), 10) :
            52;
        rectHeight = (isNaN(rectHeight)) ? 52 : rectHeight;
        const squareSize = 18;
        const lineWidth = 60;

        // Test if we should display the chart. Using this variable so we don't see
        // the rows rectangles change into small squares abruptly
        if (!self.display) {
            // Insert a line for each row of the chart
            self.insertLinesInRows(chart);

            // Insert the texts for each row of the chart. At first we need to add
            // empty texts so that the rowChart redraw does not move out confidence
            // texts around
            self.insertTextsInRows(chart);
            self.insertTextsInRows(chart, 'confidence-text-left');
            self.insertTextsInRows(chart, 'confidence-text-right');

            // Add a label to the x axis
            self.addXLabel(this.chart, 'LOG 2 FOLD CHANGE', svg, width, height);
        }

        // Finally redraw the lines in each row
        self.drawLines(chart, rectHeight / 2, lineWidth);

        // Change the row rectangles into small circles, this happens on
        // every render or redraw
        self.rectToCircles(chart, squareSize, rectHeight);

        // Only show the 0, min and max values on the xAxis ticks
        self.updateXTicks(chart);

        // Redraw confidence text next to the lines in each row
        self.renderConfidenceTexts(chart, rectHeight / 2, lineWidth, true);
        self.renderConfidenceTexts(chart, rectHeight / 2, lineWidth);

        // Finally show the chart
        self.display = true;
    }

    updateXDomain() {
        // Draw the horizontal lines
        const currentGenes = this.dataService.getGeneEntries().slice().filter((g) => {
            return g.model === this.geneService.getCurrentModel();
        });
        currentGenes.forEach((g) => {
            if (Math.abs(+g.ci_l) > this.max) {
                this.max = Math.abs(+g.ci_l);
            }
            if (Math.abs(+g.ci_r) > this.max) {
                this.max = Math.abs(+g.ci_r);
            }
        });
    }

    updateXTicks(chart: dc.RowChart) {
        const allTicks = chart.selectAll('g.axis g.tick');
        allTicks.each(function(t, i) {
            let value = parseFloat(d3.select(this).select('text').text());
            // Handle UTF-8 characters, if text is not a number, then replace all non-numeric values with the empty string
            value = isNaN(value) ? parseFloat('-' + d3.select(this).select('text').text().replace(/[^,.0-9]/g, '')) : value;

            if (i > 0 && i < allTicks.size() - 1) {
                if (value) {
                    d3.select(this).selectAll('line').style('opacity', 0);
                    d3.select(this).select('text').style('opacity', 0);
                }
            } else if (value) {
                d3.select(this).selectAll('line').style('opacity', 0);
                d3.select(this).select('text').style('opacity', 1);
            }
        });
    }

    adjustTextToElement(el: HTMLElement) {
        d3.select(el).selectAll('g.textGroup text').each(function(d, i) {
            const pRigth = isNaN(parseInt(d3.select(el).style('padding-right'), 10)) ?
                15 : parseInt(d3.select(el).style('padding-right'), 10);
            const transfString = d3.select(this).attr('transform');
            const translateString = transfString.substring(
                transfString.indexOf('(') + 1,
                transfString.indexOf(')')
            );
            const translate = (translateString.split(',').length > 1) ?
                translateString.split(',') :
                translateString.split(' ');
            const svgWidth = (isNaN(parseFloat(d3.select(el).select('svg').style('width')))) ?
                450 : parseFloat(d3.select(el).select('svg').style('width'));
            const transfX = svgWidth - pRigth;
            const ftransfx = (isNaN(transfX)) ? 0.0 : transfX;
            d3.select(this)
                .attr('transform', () => {
                    return 'translate(' + ftransfx + ',' + parseFloat(translate[1]) + ')';
                });
        });
    }

    // Moves all text in textGroups to a new HTML element
    moveTextToElement(chart: dc.RowChart, el: HTMLElement, vSpacing: number = 0) {
        const self = this;
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
        const svgEl = (chart.select('g.axis g.tick line.grid-line').node() as SVGGraphicsElement);
        // Need this condition when reloading in Edge
        if (svgEl) {
            const step = svgEl.getBBox().height /
                ((removed['nodes']().length) ? (removed['nodes']().length) : 7);

            d3.select(el).selectAll('g.textGroup text').each(function(d, i) {
                const currentStep = step * i;
                const transfX = parseFloat(newSvg.style('width')) -
                    parseFloat(d3.select(el).style('padding-right'));
                const ftransfx = (isNaN(transfX)) ? 0 : transfX;
                d3.select(this)
                    .attr('text-anchor', 'end')
                    .attr('transform', () => {
                        return 'translate(' + ftransfx + ',' + (currentStep + (vSpacing)) + ')';
                    })
                    .on('mouseover', function() {
                        self.div.transition()
                            .duration(200)
                            .style('opacity', 1);
                        self.div.html(self.chartService.getTooltipText(d3.select(this).text()))
                            .style('left', (el.getBoundingClientRect().right) + 'px')
                            .style('top', (el.offsetTop + (currentStep + (vSpacing))) + 'px');
                    })
                    .on('mouseout', function() {
                        self.div.transition()
                            .duration(500)
                            .style('opacity', 0);
                    });
            });
        }
    }

    insertLinesInRows(chart: dc.RowChart) {
        chart.selectAll('g.row')
            .insert('g')
            .attr('class', 'hline')
            .insert('line');
    }

    insertTextsInRows(chart: dc.RowChart, textClass?: string) {
        chart.selectAll('g.row')
            .insert('g')
            .attr('class', (textClass) ? textClass : 'confidence-text')
            .insert('text');
    }

    // Draw the lines through the chart rows and a vertical line at
    // x = 0
    drawLines(chart: dc.RowChart, yPos: number, lineWidth: number) {
        const self = this;
        // Hide all vertical lines except one at x = 0
        chart.selectAll('g.axis g.tick').each(function() {
            if (parseFloat(d3.select(this).select('text').text())) {
                d3.select(this).select('.grid-line').style('opacity', 0);
            } else {
                d3.select(this).select('.grid-line')
                    .style('stroke', '#BCC0CA')
                    .style('stroke-width', '2px')
                    .style('opacity', 1);
            }
        });

        // Draw the horizontal lines
        const currentGenes = this.dataService.getGeneEntries().slice().filter((g) => {
            return g.model === this.geneService.getCurrentModel();
        });
        chart.selectAll('g.row g.hline line')
            .attr('stroke-width', 1.5)
            .attr('stroke', (d, i) => {
                return self.colors[0];
            })
            // ES6 method shorthand for object literals
            .attr('x1', (d) => {
                const gene = currentGenes.slice().find((g) => {
                    return d.key[0] === g.tissue;
                });

                if (gene) {
                    const val = chart.x()(gene.ci_l);
                    return (isNaN(val)) ? 0.0 : val;
                } else {
                    return 0.0;
                }
            })
            .attr('y1', () => {
                return yPos;
            })
            .attr('x2', (d) => {
                const gene = currentGenes.slice().find((g) => {
                    return d.key[0] === g.tissue;
                });

                if (gene) {
                    const val = chart.x()(gene.ci_r);
                    return (isNaN(val)) ? 0.0 : val;
                } else {
                    return 0.0;
                }
            })
            .attr('y2', () => {
                return yPos;
            });
    }

    // Renders the confidence interval values next to the horizontal lines
    renderConfidenceTexts(chart: dc.RowChart, yPos: number, lineWidth: number, isNeg?: boolean) {
        const self = this;

        // Draw the confidence texts
        const currentGenes = this.dataService.getGeneEntries().slice().filter((g) => {
            return g.model === this.geneService.getCurrentModel();
        });
        const posQueryString = (isNeg) ? '-left' : '-right';
        const queryString = 'g.row g.confidence-text' + posQueryString + ' text';
        chart.group({
            all() {
                return self.chartService.filteredData['fpGroup'].values;
            },
            order() {
                //
            },
            top() {
                //
            }
        });
        chart.selectAll(queryString)
            // ES6 method shorthand for object literals
            .attr('x', (d) => {
                const gene = currentGenes.slice().find((g) => {
                    return d.key[0] === g.tissue;
                });

                let scaledX = 0;
                // Two significant digits
                let ciValue = 0.00;
                // Move back 0.5 pixel for the dot and 5 for each number
                let dotPixels = 0;
                const mPixels = 5;

                if (gene && gene.ci_l && gene.ci_r) {
                    dotPixels = ((gene.ci_l.toPrecision(2).indexOf('.') !== -1) ? 0.5 : 0.0);
                    ciValue = (isNeg) ? gene.ci_l : gene.ci_r;
                    scaledX = chart.x()(ciValue);
                } else {
                    dotPixels = 0.5;
                    ciValue = d.value.logfc;
                    scaledX = chart.x()(d.value.logfc) - (lineWidth / 2);
                }

                let val = 0.0;
                if (ciValue) {
                    val = (isNeg) ? scaledX - (ciValue.toPrecision(2).length * mPixels +
                        dotPixels) : scaledX + (ciValue.toPrecision(2).length * mPixels +
                        dotPixels);
                }
                return (isNaN(val)) ? 0.0 : val;
            })
            .attr('y', () => {
                return yPos + 5;
            })
            .attr('text-anchor', 'middle')
            .text((d) => {
                const gene = currentGenes.slice().find((g) => {
                    return d.key[0] === g.tissue;
                });

                let ciValue = '0.0';
                if (gene) {
                    ciValue = (isNeg) ? gene.ci_l.toPrecision(2) : gene.ci_r.toPrecision(2);
                }

                return ciValue;
            });
    }

    // Compares the current value from a group to the gene expected value
    compareAttributeValue(cValue: number, gValue: number): boolean {
        return this.dataService.getSignificantFigures(cValue) === gValue;
    }

    // Changes the chart row rects into squares of the square size
    rectToCircles(chart: dc.RowChart, squareSize: number, rectHeight: number) {
        chart
            .selectAll('g.row rect')
            .attr('transform', function(d) {
                const val = (isNaN((chart.x()(+d.value.logfc) - (squareSize / 2)))) ?
                    0.0 : (chart.x()(+d.value.logfc) - (squareSize / 2));
                return 'translate(' +
                    // X translate
                    val + ',' +
                    // Y translate
                    ((rectHeight / 2) - (squareSize / 2)) +
                ')';
            })
            .attr('width', squareSize)
            .attr('height', squareSize)
            .attr('rx', squareSize / 2)
            .attr('ry', squareSize / 2);
    }

    displayChart(): any {
        // return { opacity: (this.display) ? 1 : 0 };
        return { opacity: 1 };
    }

    onResize() {
        const self = this;
        if (this.canResize) {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                self.chart
                    .width(
                        self.rowChart.nativeElement.parentElement.offsetWidth - (self.paddingLR * 2)
                    )
                    .height(self.rowChart.nativeElement.offsetHeight  - (self.paddingUD * 2));

                if (self.chart.rescale) {
                    self.chart.rescale();
                }

                // Adjust the text as the svg reduces its width
                self.adjustTextToElement(self.stdCol.nativeElement);

                // Run code here, resizing has "stopped"
                self.chart.redraw();
            }, 100);
        }
    }
}
