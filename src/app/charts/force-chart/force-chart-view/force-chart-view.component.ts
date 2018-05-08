import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService, GeneService } from '../../../core/services';

import * as d3 from 'd3';

import { Gene } from '../../../models';

@Component({
    selector: 'force-chart',
    templateUrl: './force-chart-view.component.html',
    styleUrls: ['./force-chart-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ForceChartViewComponent implements OnInit {
    @Input() private name: string;
    @Input() private currentGene = this.geneService.getCurrentGene();

    @ViewChild('chart') private forceChart: ElementRef;

    private nodes: object[];
    private links: any;

    constructor(
        private dataService: DataService,
        private geneService: GeneService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        console.log('construct force');
    }

    ngOnInit() {
        console.log('init force');
        this.renderChart();
    }

    private renderChart() {
        const width: any = this.forceChart.nativeElement.parentElement.offsetWidth;
        const height: any = '500';
        const svg = d3.select(this.forceChart.nativeElement)
            .append('svg:svg')
            .attr('width', width)
            .attr('height', height);

        const simulation = d3.forceSimulation()
            .force('charge', d3.forceManyBody().strength(-20))
            .force('center', d3.forceCenter(width / 2, height / 2));
        this.dataService.loadNodes(this.currentGene)
            .then((data) => {
                console.log(data);
                const linkElements = svg.append('g')
                    .selectAll('line')
                    .data(data.links)
                    .enter().append('line')
                    .attr('stroke-width', (d: any) => d.value)
                    .attr('stroke', '#E5E5E5');
                const nodeElements = svg.append('g')
                    .selectAll('circle')
                    .data(data.nodes)
                    .enter().append('circle')
                    .attr('r', 7)
                    .attr('fill', this.getNodeColor)
                    .on('mouseover', (d: any) => {
                        tooltip.transition()
                            .duration(200)
                            .style('opacity', .9);
                        tooltip.html(d.hgnc_symbol)
                            .style('left', (d3.event.layerX) + 'px')
                            .style('top', (d3.event.layerY - 28) + 'px');
                    })
                    .on('mouseout', (d) => {
                        tooltip.transition()
                            .duration(500)
                            .style('opacity', 0);
                    })
                    .on('click', (d: any) => {
                        console.log('click' + d.hgnc_symbol);
                        this.viewGene(d);
                    });

                const textElements = svg.append('g')
                    .selectAll('text')
                    .data(data.nodes)
                    .enter().append('text')
                    .text((node: any) => node.hgnc_symbol)
                    .attr('font-size', 12)
                    .attr('dx', 10)
                    .attr('dy', 3);

                simulation.nodes(data.nodes).on('tick', () => {
                    linkElements
                        .attr('x1', (link: any) => link.source.x)
                        .attr('y1', (link: any) => link.source.y)
                        .attr('x2', (link: any) => link.target.x)
                        .attr('y2', (link: any) => link.target.y);
                    nodeElements
                        .attr('cx', (node: any) => node.x)
                        .attr('cy', (node: any) => node.y);
                    textElements
                        .attr('x', (node: any) => node.x)
                        .attr('y', (node: any) => node.y);
                });

                simulation.force('link', d3.forceLink(data.links)
                .links(data.links).id((d: any) => d.id)
                    .strength((link) => .001)
                    .distance(90)
                    .iterations(16))
                    .force('collide',
                        d3.forceCollide()
                            .radius(7 * 3)
                            .strength(0.7)
                            .iterations(16))
                    .force('charge', d3.forceManyBody().strength(-100))
                    .force('x', d3.forceX().strength(0.02).x(width / 2))
                    .force('y', d3.forceY().strength(0.02).y(height / 2));
                const dragDrop = d3.drag()
                    .on('start', (node: any) => {
                        node.fx = node.x;
                        node.fy = node.y;
                    })
                    .on('drag', (node: any) => {
                        simulation.alphaTarget(0.001).restart();
                        node.fx = d3.event.x;
                        node.fy = d3.event.y;
                    })
                    .on('end', (node: any) => {
                        if (!d3.event.active) {
                            simulation.alphaTarget(0);
                        }
                        node.fx = null;
                        node.fy = null;
                    });
                nodeElements.call(dragDrop);
                const tooltip = d3.select(this.forceChart.nativeElement).append('div')
                    .attr('class', 'tooltip')
                    .style('opacity', 0);
            })
            .catch((err) => { console.log(err); });
    }

    private getNodeColor(node , index, arr) {
        return !index ? 'red' : 'gray';
    }

    private viewGene(gene: Gene) {
        this.dataService.getGene(gene.hgnc_symbol).subscribe((data) => {
            if (!data['item']) { this.router.navigate(['/genes']); }
            this.geneService.setCurrentGene(data['item']);
            this.geneService.setLogFC(data['minLogFC'], data['maxLogFC']);
            this.geneService.setNegAdjPValue(data['maxNegLogPValue']);
            this.router.routeReuseStrategy.shouldReuseRoute =  () => false;
            const currentUrl = this.router.url + '?';
            this.router.navigateByUrl(currentUrl)
            .then(() => {
                this.router.navigated = false;
                this.router.navigate(['/genes',
                    {
                        outlets:
                            {
                                'genes-router': ['gene-details', data['item'].hgnc_symbol]
                            }
                    }]);
            });
        });
    }
}
