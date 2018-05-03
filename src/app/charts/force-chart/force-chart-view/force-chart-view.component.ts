import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';

import { DataService, GeneService } from '../../../core/services';

import * as d3 from 'd3';

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
        private geneService: GeneService
    ) {
        console.log('construct force');
    }

    ngOnInit() {
        const width: any = this.forceChart.nativeElement.parentElement.offsetWidth;
        const height: any = '500';
        console.log('init force');
        const svg = d3.select(this.forceChart.nativeElement)
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
                    .attr('fill', this.getNodeColor);

            const textElements = svg.append('g')
                .selectAll('text')
                .data(data.nodes)
                .enter().append('text')
                .text((node: any) => node.name)
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

            simulation.force('link', d3.forceLink(data.links).id((d: any) => d.id)
                .strength((link) => .001));
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
        })
        .catch((err) => { console.log(err); });
    }

    private getNodeColor(node , index, arr) {
        return !index ? 'red' : 'gray';
    }
}
