import {
    Component,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    Input,
    OnInit,
    AfterViewInit,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChange,
    SimpleChanges
} from '@angular/core';

import { PlatformLocation } from '@angular/common';

import { Router, NavigationStart } from '@angular/router';

import { GeneService } from '../../../core/services';

import { Subscription } from 'rxjs';

import * as d3 from 'd3';
import * as d3s from 'd3-symbol-extra';

import { Gene, GeneNetwork, GeneLink, GeneNode } from '../../../models';
import { SimulationNodeDatum, Simulation, ForceLink } from 'd3';

@Component({
    selector: 'force-chart',
    templateUrl: './force-chart-view.component.html',
    styleUrls: ['./force-chart-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ForceChartViewComponent implements OnInit, AfterViewInit, OnChanges {
    @Output() updategene: EventEmitter<Gene> = new EventEmitter<Gene>();
    @Input() name: string;
    @Input() currentGene = this.geneService.getCurrentGene();
    @Input() networkData: GeneNetwork;
    @ViewChild('chart', {static: false}) forceChart: ElementRef;

    g: any;
    zoomHandler: any;
    routerSubscription: Subscription;
    linkElements: any;
    nodeElements: any;
    textElements: any;
    svg;
    pnode: any;
    loaded: boolean = false;
    pathways: GeneNode[] = [];
    width: any;
    height: any;
    simulation: Simulation<SimulationNodeDatum, undefined>;
    hex = 'M18 2l6 10.5-6 10.5h-12l-6-10.5 6-10.5z';
    resizeTimer;

    constructor(
        private location: PlatformLocation,
        private router: Router,
        private geneService: GeneService
    ) {}

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
    }

    ngOnChanges(changes: SimpleChanges) {
        const data: SimpleChange = changes.networkData;
        if (data && data.previousValue !== data.currentValue) {
            this.updateChart();
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.width = this.forceChart.nativeElement.parentElement.offsetWidth - 30;
            this.height = 400 + (700 * (this.networkData.nodes.length / 100));
            this.loaded = true;
            this.simulation = d3.forceSimulation<GeneNode, GeneLink>()
                .force('charge', (d) => {
                    let charge = -500;
                    if (d === 0) { charge = 10 * charge; }
                    return charge;
                })
                .force('center', d3.forceCenter(this.width / 2, this.height / 2))
                .force('collision', d3.forceCollide().radius(function(d) {
                    return 35;
                }))
                .alphaDecay(0.5);
            this.renderChart();
        }, 300);
    }

    // Resets the forceSimulation variables and hides the display
    removeSelf() {
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
        if (this.simulation) {
            this.simulation.stop();
        }

        // Could not empty the selection any other way. This turns
        // the selection object into an empty array
        this.textElements = [];
        this.nodeElements = [];
        this.linkElements = [];
        this.loaded = false;
    }

    onResize(event?: any) {
        const self = this;

        this.simulation
            .force('charge', (d) => {
                let charge = -500;
                if (d === 0) { charge = 10 * charge; }
                return charge;
            })
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('collision', d3.forceCollide().radius(function(d) {
                return 35;
            }))
            .alpha(1);

        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            self.simulation.restart();
        }, 100);
    }

    getPathways(): any[] {
        return this.pathways;
    }

    renderChart() {
        if (!this.loaded) {
            return;
        }
        const self = this;

        this.svg = d3.select(this.forceChart.nativeElement)
            .append('svg:svg')
            .attr('width', this.width)
            .attr('height', this.height);

        this.g = this.svg.append('g')
            .attr('class', 'everything');
        this.zoomHandler = d3.zoom()
            // Don't allow the zoomed area to be bigger than the viewport.
            .scaleExtent([1, 1])
            .translateExtent([[-200, -300], [this.width + 200, this.height + 300]])
            .on('zoom', () => {
                // Zoom functions, this in this context is the svg
                this.svg.select('g.everything').attr('transform', d3.event.transform);
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
            .selectAll('.node')
            .data(this.networkData.nodes, (d) =>  d.id)
            .enter()
            .append('path')
            .attr('class', 'node')
            .attr('transform', 'translate(0, 0)')
            .attr('d', d3.symbol()
                .size(function(d) {
                    return (self.networkData.origin.ensembl_gene_id === d.ensembl_gene_id) ?
                    300 :
                    100;
                })
                .type(function(d) {
                    return (self.networkData.origin.ensembl_gene_id === d.ensembl_gene_id) ?
                    d3s.symbolHexagon :
                    d3.symbolCircle;
                })
            )
            .attr('origin', (d) =>
                this.networkData.origin.ensembl_gene_id === d.ensembl_gene_id
            )
            .attr('r', (d) => {
                return (this.networkData.origin.ensembl_gene_id === d.ensembl_gene_id) ?
                38 :
                17;
            })
            .attr('fill', this.getNodeColor)
            .on('click', (d: any, i, nodes ) => {
                if (this.pnode) {
                    d3.select(nodes[this.pnode.index])
                    .attr('fill', this.getNodeColor(this.pnode.node,
                            this.pnode.index,
                            []));
                }
                this.pnode = {index: i, node: d};
                d3.select(nodes[i]).attr('fill', '#FCCB6F');
                this.buildPath(d);
            })
            .on('mouseover', function() {
                d3.select(this).attr('d', d3.symbol()
                    .size(function(d) {
                        return (self.networkData.origin.ensembl_gene_id === d.ensembl_gene_id) ?
                        300 :
                        200;
                    })
                    .type(function(d) {
                        return (self.networkData.origin.ensembl_gene_id === d.ensembl_gene_id) ?
                        d3s.symbolHexagon :
                        d3.symbolCircle;
                    })
                );
            })
            .on('mouseout', function() {
                d3.select(this).attr('d', d3.symbol()
                    .size(function(d) {
                        return (self.networkData.origin.ensembl_gene_id === d.ensembl_gene_id) ?
                        300 :
                        100;
                    })
                    .type(function(d) {
                        return (self.networkData.origin.ensembl_gene_id === d.ensembl_gene_id) ?
                        d3s.symbolHexagon :
                        d3.symbolCircle;
                    })
                );
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
                    (d: any) => 'translate(' + (d.x) + ',' + (d.y) + ') scale(1.75)');

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
            .links(this.networkData.links)
            .id((d: SimulationNodeDatum) => d['id'])
            .strength((d) => {
                return d.value / 100.0;
            }));
    }

    updateChart() {
        const self = this;
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
            .data(this.networkData.nodes, (d) => d.id);
        this.nodeElements.exit().remove();
        this.nodeElements = this.nodeElements.enter()
            .append('path')
            .attr('class', (d) => {
                return (self.networkData.origin.ensembl_gene_id === d.ensembl_gene_id) ?
                'hex' :
                'node';
            })
            .attr('transform', 'translate(0, 0)')
            .attr('d', (d: any) => {
                return (self.networkData.origin.ensembl_gene_id !== d.ensembl_gene_id) ?
                (d3.symbol()
                    .size((dd) => {
                        return (self.networkData.origin.ensembl_gene_id ===
                            dd.ensembl_gene_id) ?
                            300 :
                            100;
                    })
                    .type((dd) => {
                        return (self.networkData.origin.ensembl_gene_id ===
                            dd.ensembl_gene_id) ?
                            d3s.symbolHexagon :
                            d3.symbolCircle;
                    }))(this)
                :
                self.hex;
            })
            .attr('r', (d) => {
                return (self.networkData.origin.ensembl_gene_id === d.ensembl_gene_id) ?
                38 :
                17;
            })
            .attr('fill', this.getNodeColor)
            .on('click', (d: any, i, nodes) => {
                if (this.pnode) {
                    d3.select(nodes[this.pnode.index])
                        .attr('fill', self.getNodeColor(this.pnode.node,
                            this.pnode.index,
                            []));
                }
                this.pnode = { index: i, node: d };
                d3.select(nodes[i]).attr('fill', '#4F6FC3');
                this.buildPath(d);
            })
            .merge(this.nodeElements);

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
        this.simulation.force<ForceLink<GeneNode, GeneLink>>('link').links(this.networkData.links);
        this.simulation.alpha(1).restart();
    }

    getNodeColor(node: GeneNode , index, arr): string {
        if (!!arr.length && arr[index].getAttribute('origin') === 'true') {
            return '#F47E6C';
        }
        if (this.networkData && this.networkData.origin.ensembl_gene_id === node.ensembl_gene_id) {
            return '#F47E6C';
        }
        if (node.brainregions.length >= 6) {
            return '#0C656B';
        }
        if (node.brainregions.length >= 4) {
            return '#5BB0B5';
        }
        if (node.brainregions.length >= 2) {
            return '#73C8CC';
        }
        return '#D3D5DB';
    }

    getLinkColor(link: GeneLink , index, arr): string {
        if (link.value >= 6) {
            return '#0C656B';
        }
        if (link.value >= 4) {
            return '#5BB0B5';
        }
        if (link.value >= 2) {
            return '#73C8CC';
        }
        return '#D3D5DB';
    }

    buildPath(gene: Gene) {
        this.updategene.emit(gene);
    }
}
