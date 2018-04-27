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
        this.dataService.loadNodes()
        .then((data) => {
            data.forEach((obj: any) => {
                obj.source = obj.geneA_ensembl_gene_id;
                obj.target = obj.geneB_ensembl_gene_id;
            });
            this.links = data;
            this.nodes = data.filter((obj, pos, arr) => {
                 if (obj.geneA_ensembl_gene_id === this.nodeA) {
                     obj.id = obj.geneB_ensembl_gene_id;
                     return obj;
                 }
            });
            this.nodes.unshift({
                geneB_ensembl_gene_id: this.nodeA,
                geneB_external_gene_name: 'MTND1P23',
                geneA_ensembl_gene_id: this.nodeA,
                geneA_external_gene_name: 'MTND1P23',
                id: this.nodeA
            });
            console.log(this.nodes);
            const nodeElements = svg.append('g')
                    .selectAll('circle')
                    .data(this.nodes)
                    .enter().append('circle')
                    .attr('r', 4)
                    .attr('fill', this.getNodeColor);

            const textElements = svg.append('g')
                    .selectAll('text')
            .data(this.nodes)
            .enter().append('text')
                .text((node: any) => node.geneB_external_gene_name)
            .attr('font-size', 12)
            .attr('dx', 10)
            .attr('dy', 3);

            simulation.nodes(this.nodes).on('tick', () => {
                nodeElements
                    .attr('cx', (node: any) => node.x)
                    .attr('cy', (node: any) => node.y);
                textElements
                    .attr('x', (node: any) => node.x)
                    .attr('y', (node: any) => node.y);
            });
            const linkElements = svg.append('g')
                .selectAll('line')
                .data(this.links)
                .enter().append('line')
                .attr('stroke-width', 1)
                .attr('stroke', '#E5E5E5');
            linkElements
                .attr('x1', (link: any) => link.source.x)
                .attr('y1', (link: any) => link.source.y)
                .attr('x2', (link: any) => link.target.x)
                .attr('y2', (link: any) => link.target.y);
            simulation.force('link', d3.forceLink(this.links).id( (d: any) => {
                return d.id;
            }));
        })
        .catch((err) => { console.log(err); });
    }

    private getNodeColor(node) {
        return node.geneB_ensembl_gene_id === 'ENSG00000225972' ? 'red' : 'gray';
    }
}
