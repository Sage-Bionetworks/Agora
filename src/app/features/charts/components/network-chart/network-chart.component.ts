import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import * as d3 from 'd3';

import { HelperService } from '../../../../core/services';
import { GeneNetwork, GeneLink, GeneNode } from '../../../../models';

import { hexagonSymbol } from '.';

@Component({
  selector: 'network-chart',
  templateUrl: './network-chart.component.html',
  styleUrls: ['./network-chart.component.scss'],
})
export class NetworkChartComponent {
  _data: GeneNetwork | undefined;
  get data(): GeneNetwork | undefined {
    return this._data;
  }
  @Input() set data(data: GeneNetwork | undefined) {
    this._data = data;
    this.init();
  }

  _selectedFilter = 0;
  get selectedFilter(): number {
    return this._selectedFilter;
  }
  @Input() set selectedFilter(n: number) {
    this._selectedFilter = n;
    this.filter();
  }

  width = 800;
  height = 800;

  group: any;
  links: any;
  nodes: any;
  mainNode: any;
  texts: any;
  simulation: any;

  selectedNode: GeneNode | undefined;
  highlightColor = '#FCCB6F';
  zoomHandler: any;

  chart: any;
  isInitialized = false;

  resizeTimer: ReturnType<typeof setTimeout> | number = 0;

  @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef =
    {} as ElementRef;

  @Output() onNodeClick: EventEmitter<any> = new EventEmitter();

  constructor(private helperService: HelperService) {}

  init() {
    if (!this._data?.nodes?.length || !this.chartContainer?.nativeElement) {
      return;
    }

    this.initChart();
    this.isInitialized = true;
  }

  initChart() {
    if (!this._data?.nodes?.length) {
      return;
    }

    this.width =
      this.chartContainer.nativeElement.parentElement.offsetWidth - 30;
    this.height = 400 + 700 * (this._data.nodes.length / 100);

    this.chart = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.group = this.chart.append('g');

    this.initZoom();
    this.initLinks();
    this.initNodes();
    this.initSimulation();

    this.filter();
  }

  initZoom() {
    this.zoomHandler = d3
      .zoom()
      // Don't allow the zoomed area to be bigger than the viewport.
      .scaleExtent([1, 1])
      .translateExtent([
        [-200, -300],
        [this.width + 200, this.height + 300],
      ])
      .on('zoom', (e) => {
        // Zoom functions, this in this context is the svg
        this.group.attr('transform', e.transform);
      });
    this.zoomHandler(this.chart);
    this.chart.call(this.zoomHandler);
  }

  initLinks() {
    if (!this._data?.links?.length) {
      return;
    }

    this.links = this.group
      .selectAll('line')
      .data(this._data.links)
      .enter()
      .append('line')
      .attr('stroke-width', 2)
      .style('stroke', (link: GeneLink) => this.getLinkColor(link));
  }

  initNodes() {
    if (!this._data?.nodes?.length) {
      return;
    }

    this.selectedNode = this._data.nodes[0];

    this.mainNode = this.group
      .selectAll('path')
      .data([this._data.nodes[0]])
      .enter()
      .append('path')
      .attr('d', d3.symbol().size(900).type(hexagonSymbol))
      .style('fill', (node: GeneNode) => this.getNodeColor(node))
      .on('click', (e: any, node: any) => {
        this.selectedNode = node;
        this.mainNode.style('fill', (node: any) => {
          return this.getNodeColor(node);
        });
        this.nodes.style('fill', (node: any) => {
          return this.getNodeColor(node);
        });
        this.onNodeClick.emit(node);
      })
      .on('mouseover', (e: any) => {
        d3.select(e.path[0]).style('fill', this.highlightColor);
      })
      .on('mouseout', (e: any, node: GeneNode) => {
        d3.select(e.path[0]).style('fill', this.getNodeColor(node));
      });

    this.nodes = this.group
      .selectAll('circle')
      .data(this._data.nodes.slice(1))
      .enter()
      .append('circle')
      .attr('r', 10)
      .style('fill', (node: GeneNode) => this.getNodeColor(node))
      .on('click', (e: any, node: any) => {
        this.selectedNode = node;
        this.mainNode.style('fill', (node: any) => {
          return this.getNodeColor(node);
        });
        this.nodes.style('fill', (node: any) => {
          return this.getNodeColor(node);
        });
        this.onNodeClick.emit(node);
      })
      .on('mouseover', (e: any) => {
        d3.select(e.path[0]).attr('r', 14).style('fill', this.highlightColor);
      })
      .on('mouseout', (e: any, node: GeneNode) => {
        d3.select(e.path[0])
          .attr('r', 10)
          .style('fill', this.getNodeColor(node));
      });

    this.texts = this.group
      .selectAll('text')
      .data(this._data.nodes)
      .enter()
      .append('text')
      .text((node: any) => node.hgnc_symbol || node.ensembl_gene_id)
      .attr('font-size', 12);
  }

  initSimulation() {
    if (!this._data?.nodes?.length) {
      return;
    }

    this.simulation = d3
      .forceSimulation(this._data.nodes)
      .force(
        'link',
        d3
          .forceLink()
          .id(function (d: any) {
            return d.id;
          })
          .links(this._data.links)
      )
      .force('charge', d3.forceManyBody().strength(-450))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force(
        'collision',
        d3.forceCollide().radius(() => 35)
      )
      .alphaDecay(0.5)
      .on('end', () => {
        this.refreshPositions();
      });
  }

  refreshPositions() {
    this.links
      .attr('x1', function (d: any) {
        return d.source.x;
      })
      .attr('y1', function (d: any) {
        return d.source.y;
      })
      .attr('x2', function (d: any) {
        return d.target.x;
      })
      .attr('y2', function (d: any) {
        return d.target.y;
      });

    this.nodes
      .attr('cx', function (d: any) {
        return d.x;
      })
      .attr('cy', function (d: any) {
        return d.y;
      });

    this.mainNode.style('transform', function (d: any) {
      return 'translate(' + d.x + 'px, ' + d.y + 'px) rotate(30deg)';
    });

    this.texts
      .attr('x', function (d: any) {
        return d.x;
      })
      .attr('dx', (d: any) => {
        // A font size of 12 has 16 pixels per letter, so we pick
        // half the word and make a negative dx. The anchor is in
        // the middle so we half the result again
        return (
          (-(d.hgnc_symbol?.length || d.ensembl_gene_id.length) * 16) / 2 / 2
        );
      })
      .attr('y', function (d: any) {
        return d.y + 30;
      });
  }

  getNodeColor(node: GeneNode) {
    if (
      this.selectedNode &&
      node.ensembl_gene_id === this.selectedNode.ensembl_gene_id
    ) {
      return this.highlightColor;
    } else if (
      this._data?.nodes?.length &&
      node.ensembl_gene_id === this._data.nodes[0].ensembl_gene_id
    ) {
      return '#F47E6C';
    }

    return this.getColor(node.value);
  }

  getLinkColor(link: GeneLink) {
    return this.getColor(link.value);
  }

  getColor(value: number) {
    if (value >= 8) {
      return '#1C3A35';
    } else if (value >= 6) {
      return '#0C656B';
    } else if (value >= 4) {
      return '#5BB0B5';
    } else if (value >= 2) {
      return '#73C8CC';
    }
    return '#D3D5DB';
  }

  filter() {
    const hiddenNodes: string[] = [];

    this.nodes.attr('display', (node: GeneNode) => {
      if (node.value < this._selectedFilter) {
        hiddenNodes.push(node.id);
        return 'none';
      }
      return 'block';
    });

    this.texts.attr('display', (node: GeneNode) =>
      node.value < this._selectedFilter ? 'none' : 'block'
    );

    this.links.attr('display', (link: GeneLink) =>
      hiddenNodes.includes(link.source.id) ||
      hiddenNodes.includes(link.target.id)
        ? 'none'
        : 'block'
    );
  }

  onResize() {
    const self = this;
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      self.width =
        self.chartContainer.nativeElement.parentElement.offsetWidth - 30;
      self.height = 400 + 700 * ((self._data?.nodes?.length || 0) / 100);
      self.chart.attr('width', self.width).attr('height', self.height);
      self.group.attr('transform', 'translate(0px, 0px)');
    }, 100);
  }
}
