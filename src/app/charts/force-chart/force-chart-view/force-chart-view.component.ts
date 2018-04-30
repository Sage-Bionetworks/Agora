import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';

import { DataService } from '../../../core/services';

import * as d3 from 'd3';

@Component({
    selector: 'force-chart',
    templateUrl: './force-chart-view.component.html',
    styleUrls: ['./force-chart-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ForceChartViewComponent implements OnInit {
    @Input() private title: string;

    @ViewChild('chart') private forceChart: ElementRef;

    private nodes: object[];
    private links: any;
    private nodeA: string = 'ENSG00000225972';

    constructor(private dataService: DataService) {
        console.log('construct force');
    }

    public  ngOnInit() {
        const width: any = '650';
        const height: any = '500';
        console.log('init force');
        const svg = d3.select(this.forceChart.nativeElement)
            .attr('width', width)
            .attr('height', height);

        const simulation = d3.forceSimulation()
            .force('charge', d3.forceManyBody().strength(-20))
            .force('center', d3.forceCenter(width / 2, height / 2));
        this.dataService.loadNodes(this.nodeA)
        .then((data) => {
            data.nodes.unshift({
                group: 1,
                id: this.nodeA,
                name: 'MTND1P23'
            });
            console.log(data);
            const nodeElements = svg.append('g')
                    .selectAll('circle')
                    .data(data.nodes)
                    .enter().append('circle')
                    .attr('r', 5)
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
                nodeElements
                    .attr('cx', (node: any) => node.x)
                    .attr('cy', (node: any) => node.y);
                textElements
                    .attr('x', (node: any) => node.x)
                    .attr('y', (node: any) => node.y);
            });
            const linkElements = svg.append('g')
                .selectAll('line')
                .data(data.links)
                .enter().append('line')
                .attr('stroke-width', 1)
                .attr('stroke', '#E5E5E5');
            linkElements
                .attr('x1', (link: any) => link.source.x)
                .attr('y1', (link: any) => link.source.y)
                .attr('x2', (link: any) => link.target.x)
                .attr('y2', (link: any) => link.target.y);
            simulation.force('link', d3.forceLink(data.links).id( (d: any) => {
                return d.id;
            }).strength((link) => .001));

            const dragDrop = d3.drag()
                .on('start', (node: any) => {
                    node.fx = node.x;
                    node.fy = node.y;
                })
                .on('drag', (node: any) => {
                    simulation.alphaTarget(0.7).restart();
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

    private getNodeColor(node) {
        return node.id === 'ENSG00000225972' ? 'red' : 'gray';
    }

    private getNeighbors(node) {
        return this.links.reduce((neighbors, link) => {
            if (link.target.id === node.id) {
                neighbors.push(link.source.id);
            } else if (link.source.id === node.id) {
                neighbors.push(link.target.id);
            }
            return neighbors;
        }, [node.id]);
    }
}
