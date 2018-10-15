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

    private linkElements: any;
    private nodeElements: any;
    private textElements: any;
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
        setTimeout(() => {
            this.width = this.forceChart.nativeElement.parentElement.offsetWidth;
            this.height = this.forceChart.nativeElement.offsetHeight;
            if (this.height < 600) {
                this.height = 500;
            }
            this.loaded = true;
            this.simulation = d3.forceSimulation()
                .force('charge', d3.forceManyBody().strength(-10))
                .force('center', d3.forceCenter(this.width / 2, this.height / 2));
            this.renderChart();
        }, 300);
    }

    onResize(event?: any) {
        this.width = this.forceChart.nativeElement.parentElement.offsetWidth;
        this.height = this.forceChart.nativeElement.offsetHeight - 30;
        if (this.height > 900 || this.height < 500) {
            this.height = 500;
            this.forceChart.nativeElement.children[0].setAttribute('height', this.height);
            this.height = this.forceChart.nativeElement.offsetHeight - 30;
        }
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

        this.linkElements = this.svg.append('g')
                    .attr('class', 'line')
                    .selectAll('line')
                    .data(this.networkData.links,
                     (d) =>  d.source.id + '-' + d.target.id)
                    .enter().append('line')
                    .attr('stroke-width', 2 )
                    .attr('stroke', this.getLinkColor);

        this.nodeElements = this.svg.append('g')
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

        this.textElements = this.svg.append('g')
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
                    if (this.width / 2 < node.x) {
                        return -Math.abs(node.hgnc_symbol.length * 6) - 32;
                    }
                    return '23';
                });

            this.linkElements
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
            })
            .on('drag', (node: any) => {
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
            });
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
