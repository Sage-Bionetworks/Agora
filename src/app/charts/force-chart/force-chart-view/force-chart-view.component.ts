import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    Input,
    AfterViewInit
} from '@angular/core';
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
export class ForceChartViewComponent implements AfterViewInit {
    @Input() name: string;
    @Input() private currentGene = this.geneService.getCurrentGene();

    @ViewChild('chart') private forceChart: ElementRef;

    private nodes: object[];
    private links: any;
    private d3: any;
    private cachedGene: Gene = this.currentGene;
    private pathways: any[] = [];
    private width: any;
    private height: any;

    constructor(
        private dataService: DataService,
        private geneService: GeneService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.d3 = d3;
        console.log('construct force');
    }

    ngAfterViewInit() {
        this.width = this.forceChart.nativeElement.parentElement.offsetWidth;
        this.height = this.forceChart.nativeElement.offsetHeight;
        this.renderChart();
    }

    private onResize(event) {
        this.width = this.forceChart.nativeElement.parentElement.offsetWidth;
        this.height = this.forceChart.nativeElement.offsetHeight;
        this.forceChart.nativeElement.children[0].setAttribute('width', this.width);
    }

    private renderChart() {
        const svg = d3.select(this.forceChart.nativeElement)
            .append('svg:svg')
            .attr('width', this.width)
            .attr('height', this.height);

        const simulation = d3.forceSimulation()
            .force('charge', d3.forceManyBody().strength(-100))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2));
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
                    .on('mouseover', (d: Gene) => {
                        tooltip.transition()
                            .duration(200)
                            .style('opacity', .9);
                        tooltip.html('<h3>Loading...</h3>')
                            .style('left', (d3.event.layerX) + 'px')
                            .style('top', (d3.event.layerY - 28) + 'px');
                        if (d.hgnc_symbol !== this.cachedGene.hgnc_symbol) {
                            this.dataService.getGene(d.hgnc_symbol).subscribe((lgene: any) => {
                                if (!lgene.item) {
                                    tooltip.html(`
                            <h3>Gene information not found.</h3>`);
                                    return;
                                }
                                this.cachedGene = lgene.item;
                                this.tooltipFill(lgene.item, tooltip);
                            });
                        } else {
                            this.tooltipFill(this.cachedGene, tooltip);
                        }
                    })
                    .on('mouseout', (d) => {
                        tooltip.transition()
                            .duration(500)
                            .style('opacity', 0);
                    })
                    .on('click', (d: any) => {
                        console.log('click' + d.hgnc_symbol);
                        //this.viewGene(d);
                        console.log(d);
                        this.buildPath(d);
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
                    nodeElements
                        .attr('cx', (node: any) => node.x = Math.max(7,
                            Math.min(this.width - 7, node.x)))
                        .attr('cy', (node: any) => node.y = Math.max(7,
                            Math.min(this.height - 7, node.y)));
                    textElements
                        .attr('x', (node: any) => node.x)
                        .attr('y', (node: any) => node.y);
                    linkElements
                        .attr('x1', (link: any) => link.source.x)
                        .attr('y1', (link: any) => link.source.y)
                        .attr('x2', (link: any) => link.target.x)
                        .attr('y2', (link: any) => link.target.y);
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
                            .iterations(16));

                const dragDrop = d3.drag()
                    .on('start', (node: any) => {
                        node.fx = node.x;
                        node.fy = node.y;
                        tooltip.transition()
                            .duration(500)
                            .style('opacity', 0);
                    })
                    .on('drag', (node: any) => {
                        simulation.alphaTarget(0.001).restart();
                        node.fx = d3.event.x;
                        node.fy = d3.event.y;
                        tooltip
                            .style('opacity', 0);
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

    private tooltipFill(gene: Gene, tooltip) {
        tooltip.html(`
            <h3>${gene.hgnc_symbol}</h3>
            <div>Study: ${gene.Study}</div>
            <div>Tissue: ${gene.Tissue}</div>
            <div>Lenght ${gene.gene_length}</div>
            <div>Sex: ${gene.Sex}</div>
        `);
    }

    private buildPath(gene: Gene) {
        console.log(gene);
        this.dataService.loadNodes(gene).then((data: any) => {
            this.pathways = data.nodes;
        });
    }

    private viewGene(gene: Gene) {
        this.dataService.getGene(gene.hgnc_symbol).subscribe((data) => {
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            const currentUrl = this.router.url + '?';
            if (!data['item']) {
                this.router.navigate(['/genes']);
                return;
            }
            this.geneService.setCurrentGene(data['item']);
            this.geneService.setLogFC(data['minLogFC'], data['maxLogFC']);
            this.geneService.setNegAdjPValue(data['maxNegLogPValue']);
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
