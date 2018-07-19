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
import { Router, ActivatedRoute } from '@angular/router';
import { DataService, GeneService } from '../../../core/services';

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

    filter = {
        active: true
    };
    private svg;
    private pnode: any;
    private loaded: boolean = false;
    private pathways: GeneNode[] = [];
    private nodes: GeneNode[];
    private links: GeneLink[];
    private width: any;
    private height: any;
    private simulation: any;
    private hex = 'M18 2l6 10.5-6 10.5h-12l-6-10.5 6-10.5z';
    constructor(
        private dataService: DataService,
        private geneService: GeneService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        const data: SimpleChange = changes.networkData;
        if (data.previousValue !== data.currentValue) {
            this.updateChart();
        }
    }

    ngAfterViewInit() {
        this.width = this.forceChart.nativeElement.parentElement.offsetWidth;
        this.height = this.forceChart.nativeElement.offsetParent.offsetHeight;
        this.loaded = true;
        this.renderChart();
    }

    onResize(event) {
        this.width = this.forceChart.nativeElement.parentElement.offsetWidth;
        this.height = this.forceChart.nativeElement.offsetParent.offsetHeight;
        this.forceChart.nativeElement.children[0].setAttribute('width', this.width);
        this.forceChart.nativeElement.children[0].setAttribute('height', this.height);

        this.simulation.force('center', d3.forceCenter(this.width / 2, this.height / 2));
        this.simulation.force('charge', d3.forceManyBody());
        this.simulation.force('link', d3.forceLink(this.networkData.links)
            .links(this.networkData.links).id((d: any) => d.id)
            .distance(this.width / 3))
            .force('collide', d3.forceCollide()
                .radius(18)
                .strength(0.5))
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
        this.svg = d3.select(this.forceChart.nativeElement)
            .append('svg:svg')
            .attr('width', this.width)
            .attr('height', this.height);

        this.simulation = d3.forceSimulation()
            .force('charge', d3.forceManyBody().strength(-10))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2));

        const linkElements = this.svg.append('g')
                    .selectAll('line')
                    .data(this.networkData.links)
                    .enter().append('line')
                    .attr('stroke-width', 2 )
                    .attr('stroke', this.getLinkColor);

        const nodeElements = this.svg.append('g')
                    .selectAll('.hex')
                    .data(this.networkData.nodes)
                    .enter()
                    .append('g');

        nodeElements.append('path')
                    .attr('d', this.hex)
                    .attr('transform', 'scale(1.75)')
                    .attr('r', 4)
                    .attr('fill', this.getNodeColor)
                    .attr('class', 'hex')
                    .on('mouseover', (d: GeneNode) => {
                        // tooltip.transition()
                        //     .duration(200)
                        //     .style('opacity', .9);
                        // tooltip.html('<h3>Loading...</h3>')
                        //     .style('left', (d3.event.layerX + 28) + 'px')
                        //     .style('top', (d3.event.layerY - 28) + 'px');
                        // if (d.hgnc_symbol !== this.cachedGene.hgnc_symbol) {
                        //     this.dataService.getGene(d.hgnc_symbol).subscribe((lgene: any) => {
                        //         if (!lgene.item) {
                        //             tooltip.html(`
                        //     <h3>Gene information not found.</h3>`);
                        //             return;
                        //         }
                        //         this.cachedGene = lgene.item;
                        //         this.tooltipFill(lgene.item, tooltip);
                        //     });
                        // } else {
                        //     this.tooltipFill(this.cachedGene, tooltip);
                        // }
                    })
                    .on('mouseout', (d) => {
                        // tooltip.transition()
                        //     .duration(500)
                        //     .style('opacity', 0);
                    })
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

        const textElements = this.svg.append('g')
                    .selectAll('text')
                    .data(this.networkData.nodes)
                    .enter().append('text')
                    .text((node: any) => node.hgnc_symbol)
                    .attr('font-size', 12)
                    .attr('dx', 13)
                    .attr('dy', 4);

        this.simulation.nodes(this.networkData.nodes).on('tick', () => {
                    nodeElements
                        .attr('cx', (node: any) => node.x = Math.max(24,
                            Math.min(this.width - 24, node.x)))
                        .attr('cy', (node: any) => node.y = Math.max(24,
                            Math.min(this.height - 24, node.y)));
                    nodeElements.attr('transform',
                    (d: any) =>  'translate(' + (d.x - 22) + ',' + (d.y - 22) + ')');
                    textElements
                        .attr('x', (node: any) => node.x)
                        .attr('y', (node: any) => node.y)
                        .attr('dx', (node: any) => {
                            if (this.width / 2 < node.x ) {
                                return -Math.abs(node.hgnc_symbol.length * 6) - 32;
                            }
                            return '23';
                        });
                    linkElements
                        .attr('x1', (link: any) => link.source.x)
                        .attr('y1', (link: any) => link.source.y)
                        .attr('x2', (link: any) => link.target.x)
                        .attr('y2', (link: any) => link.target.y);
                });

        this.simulation.force('link', d3.forceLink(this.networkData.links)
            .links(this.networkData.links).id((d: GeneNode) => d.id)
            .distance(this.width / 3))
            .force('collide', d3.forceCollide()
                .radius(18)
                .strength(0.5));

        const dragDrop = d3.drag()
                    .on('start', (node: any) => {
                        if (!d3.event.active) {
                            this.simulation.alphaTarget(0).restart();
                        }
                        node.fx = node.x;
                        node.fy = node.y;
                        tooltip.transition()
                            .duration(500)
                            .style('opacity', 0);
                    })
                    .on('drag', (node: any) => {
                        this.simulation.alphaTarget(0).restart();
                        node.fx = d3.event.x;
                        node.fy = d3.event.y;
                        tooltip
                            .style('opacity', 0);
                    })
                    .on('end', (node: any) => {
                        if (!d3.event.active) {
                            this.simulation.alphaTarget(0);
                        }
                        node.fx = null;
                        node.fy = null;
                    });
        nodeElements.call(dragDrop);
        const tooltip = d3.select(this.forceChart.nativeElement).append('div')
                    .attr('class', 'tooltip')
                    .style('opacity', 0);
    }

    private updateChart() {
        if (!this.loaded) {
            return;
        }

        // linkElements
        const linkElements = this.svg.select('g')
            .selectAll('line')
            .data(this.networkData.links);
        linkElements.exit().remove();

        // node elements
        const nodeElements = this.svg.select('g')
            .selectAll('.hex')
            .data(this.networkData.nodes);
        nodeElements.exit().remove();

        // text elements
        const textElements = this.svg.select('g')
            .selectAll('text')
            .data(this.networkData.nodes);
        textElements.exit().remove();
        textElements.enter().append('text')
            .text((node: any) => node.hgnc_symbol)
            .attr('font-size', 12)
            .attr('dx', 23)
            .attr('dy', 4);
    }

    private getNodeColor(node: GeneNode , index, arr) {
        if (!index) {
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
        // return !index ? '#F5DAB4' : '#BCC0CA';
    }

    private getLinkColor(link: GeneLink , index, arr) {
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

    private tooltipFill(gene: Gene, tooltip) {
        tooltip.html(`
            <h3>${gene.hgnc_symbol}</h3>
            <div>Study: ${gene.study}</div>
            <div>Tissue: ${gene.tissue}</div>
            <div>Lenght ${gene.gene_length}</div>
            <div>Sex: ${gene.sex}</div>
        `);
    }

    private buildPath(gene: Gene) {
        this.updategene.emit(gene);
    }
}
