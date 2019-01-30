import {
    Component,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    Input,
    AfterViewInit,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChange,
    SimpleChanges
} from '@angular/core';
import { GeneService } from '../../../core/services';

import * as d3 from 'd3';

import { Gene, GeneNetwork, GeneLink, GeneNode } from '../../../models';

@Component({
    selector: 'force-chart',
    templateUrl: './force-chart-view.component.html',
    styleUrls: ['./force-chart-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ForceChartViewComponent implements AfterViewInit, OnChanges {
    @Output() updategene: EventEmitter<Gene> = new EventEmitter<Gene>();
    @Input() name: string;
    @Input() currentGene = this.geneService.getCurrentGene();
    @Input() networkData: GeneNetwork;
    @ViewChild('chart') forceChart: ElementRef;

    g: any;
    zoomHandler: any;

    private linkElements: any;
    private nodeElements: any;
    private textElements: any;
    private svg;
    private pnode: any;
    private loaded: boolean = false;
    private pathways: GeneNode[] = [];
    private width: any;
    private height: any;
    private simulation: any;
    private hex = 'M18 2l6 10.5-6 10.5h-12l-6-10.5 6-10.5z';

    constructor(
        private geneService: GeneService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        const data: SimpleChange = changes.networkData;
        if (data.previousValue !== data.currentValue) {
            this.updateChart();
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            console.log(this.forceChart.nativeElement);
            this.width = this.forceChart.nativeElement.parentElement.offsetWidth - 30;
            this.height = this.forceChart.nativeElement.parentElement.parentElement
                .parentElement.parentElement.offsetHeight - 30;
            this.loaded = true;
            this.simulation = d3.forceSimulation()
                .force('charge', (d) => {
                    let charge = -500;
                    if (d === 0) { charge = 10 * charge; }
                    return charge;
                })
                .force('center', d3.forceCenter(this.width / 2, this.height / 2))
                .force('collision', d3.forceCollide().radius(function(d) {
                    return 35;
                }));
            this.renderChart();
        }, 300);
    }

    onResize(event?: any) {
        this.width = this.forceChart.nativeElement.parentElement.offsetWidth - 30;
        this.height = this.forceChart.nativeElement.parentElement.parentElement.offsetHeight - 30;

        this.zoomHandler(this.svg);
        this.simulation.force('charge', (d) => {
                let charge = -500;
                if (d === 0) { charge = 10 * charge; }
                return charge;
            })
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('collision', d3.forceCollide().radius(function(d) {
                return 35;
            }))
            .alpha(0.3)
            .restart();
    }

    getPathways(): any[] {
        return this.pathways;
    }

    private renderChart() {
        if (!this.loaded) {
            return;
        }

        console.log(this.height);
        this.svg = d3.select(this.forceChart.nativeElement)
            .append('svg:svg')
            .attr('width', this.width)
            .attr('height', this.height);

        this.g = this.svg.append('g')
            .attr('class', 'everything');
        this.zoomHandler = d3.zoom()
            // Don’t allow the zoomed area to be bigger than the viewport.
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [this.width, this.height]])
            .extent([[0, 0], [this.width, this.height]])
            .on('zoom', () => {
                // Zoom functions, this in this context is the svg
                this.svg.select('g.everything')
                    .style('transform', 'scale(' + d3.event.transform.k + ')');
            });
        this.zoomHandler(this.svg);
        this.svg.call(this.zoomHandler);

        this.linkElements = this.g.append('g')
            .attr('class', 'line')
            .selectAll('line')
            .data(this.networkData.links,
                (d) =>  d.source.id + '-' + d.target.id)
            .enter().append('line')
            .attr('stroke-width', 2 )
            .attr('stroke', this.getLinkColor);

        this.nodeElements = this.g.append('g')
            .attr('class', 'node')
            .selectAll('.hex')
            .data(this.networkData.nodes, (d) =>  d.id)
            .enter()
            .append('path')
            .attr('d', this.hex)
            .attr('origin', (d) =>
            this.networkData.origin.ensembl_gene_id === d.ensembl_gene_id)
            .attr('r', 4)
            .attr('fill', this.getNodeColor)
            .attr('class', 'hex')
            .on('click', (d: any, i, nodes ) => {
                if (this.pnode) {
                    d3.select(nodes[this.pnode.index])
                    .attr('fill', this.getNodeColor(this.pnode.node,
                            this.pnode.index,
                            []));
                }
                this.pnode = {index: i, node: d};
                d3.select(nodes[i]).attr('fill', '#4F6FC3');
                this.buildPath(d);
            });

        this.textElements = this.g.append('g')
            .attr('class', 'text')
            .selectAll('text')
            .data(this.networkData.nodes, (d) =>  d.id)
            .enter().append('text')
            .text((node: any) => node.hgnc_symbol)
            .attr('font-size', 12)
            .attr('dx', 13)
            .attr('dy', 4);

        this.simulation.nodes(this.networkData.nodes).on('tick', () => {
            this.nodeElements
                .attr('cx', (node: any) => node.x = Math.max(24,
                    Math.min(this.width - 24, node.x)))
                .attr('cy', (node: any) => node.y = Math.max(24,
                    Math.min(this.height - 24, node.y)))
                .attr('transform',
                    (d: any) => 'translate(' + (d.x - 22) + ',' + (d.y - 22) + ') scale(1.75)');

            this.textElements
                .attr('x', (node: any) => node.x)
                .attr('y', (node: any) => node.y)
                .attr('dx', (node: any) => {
                    // A font size of 12 has 16 pixels per letter, so we pick
                    // half the word and make a negative dx. The anchor is in
                    // the middle so we half the result again
                    return (((-node.hgnc_symbol.length * 16) / 2) / 2);
                })
                .attr('dy', (node: any) => {
                    return 35;
                });

            this.linkElements
                .attr('x1', (link: any) => link.source.x)
                .attr('y1', (link: any) => link.source.y)
                .attr('x2', (link: any) => link.target.x)
                .attr('y2', (link: any) => link.target.y);
        });

        this.simulation.force('link', d3.forceLink(this.networkData.links)
            .links(this.networkData.links).id((d: GeneNode) => d.id)
            .strength((d) => {
                return d.value / 100.0;
            }));

        this.nodeElements.call(this.dragDrop());
    }

    private dragDrop() {
        return d3.drag()
            .on('start', (node: any) => {
                if (!d3.event.active) {
                    this.simulation.alphaTarget(0).restart();
                }
                node.fx = node.x;
                node.fy = node.y;
            });
            /*.on('drag', (node: any) => {
                this.simulation.alphaTarget(0).restart();
                node.fx = d3.event.x;
                node.fy = d3.event.y;
            })
            .on('end', (node: any) => {
                if (!d3.event.active) {
                    this.simulation.alphaTarget(0);
                }
                node.fx = null;
                node.fy = null;
            });*/
    }

    private updateChart() {
        if (!this.loaded) {
            return;
        }
        if (this.pnode) {
            d3.select(this.nodeElements.nodes()[this.pnode.index])
                .attr('fill', this.getNodeColor(this.pnode.node,
                    this.pnode.index,
                    []));
            this.pnode = null;
        }
        // linkElements
        this.linkElements = this.linkElements
            .data(this.networkData.links, (d) =>  d.source.id + '-' + d.target.id);
        this.linkElements.exit().remove();
        this.linkElements = this.linkElements.enter().append('line')
            .attr('stroke-width', 2)
            .attr('stroke', this.getLinkColor)
            .merge(this.linkElements);

        // node elements
        this.nodeElements = this.nodeElements
            .data(this.networkData.nodes, (d) =>  d.id);
        this.nodeElements.exit().remove();
        this.nodeElements = this.nodeElements.enter()
            .append('path')
            .attr('d', this.hex)
            .attr('r', 4)
            .attr('fill', this.getNodeColor)
            .attr('class', 'hex')
            .on('click', (d: any, i, nodes) => {
                if (this.pnode) {
                    d3.select(nodes[this.pnode.index])
                        .attr('fill', this.getNodeColor(this.pnode.node,
                            this.pnode.index,
                            []));
                }
                this.pnode = { index: i, node: d };
                d3.select(nodes[i]).attr('fill', '#4F6FC3');
                this.buildPath(d);
            })
            .merge(this.nodeElements);

        this.nodeElements.call(this.dragDrop());

        // text elements
        this.textElements = this.textElements
            .data(this.networkData.nodes, (d) =>  d.id);
        this.textElements.exit().remove();
        this.textElements = this.textElements.enter().append('text')
            .text((node: any) => node.hgnc_symbol)
            .attr('font-size', 12)
            .attr('dx', 23)
            .attr('dy', 4)
            .merge(this.textElements);

        this.simulation.nodes(this.networkData.nodes);
        this.simulation.force('link').links(this.networkData.links);
        this.simulation.alpha(1).restart();

        // this.onResize();
    }

    private getNodeColor(node: GeneNode , index, arr): string {
        if (!!arr.length && arr[index].getAttribute('origin') === 'true') {
            return '#F38070';
        }
        if (this.networkData && this.networkData.origin.ensembl_gene_id === node.ensembl_gene_id) {
            return '#F38070';
        }
        if (node.brainregions.length >= 6) {
            return '#11656A';
        }
        if (node.brainregions.length >= 4) {
            return '#5DAFB4';
        }
        if (node.brainregions.length >= 2) {
            return '#A7DDDF';
        }
        return '#BCC0CA';
    }

    private getLinkColor(link: GeneLink , index, arr): string {
        if (link.value >= 6) {
            return '#11656A';
        }
        if (link.value >= 4) {
            return '#5DAFB4';
        }
        if (link.value >= 2) {
            return '#A7DDDF';
        }
        return '#BCC0CA';
    }

    private buildPath(gene: Gene) {
        this.updategene.emit(gene);
    }
}
