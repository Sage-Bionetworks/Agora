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
} from '@angular/core';

import * as d3 from 'd3';

import {
  GeneNetwork,
  GeneLink,
  GeneNode,
  RnaDifferentialExpression,
} from '../../../../models';

import { hexagonSymbol } from '.';

@Component({
  selector: 'force-chart',
  templateUrl: './force-chart.component.html',
  styleUrls: ['./force-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ForceChartComponent implements OnInit, AfterViewInit, OnChanges {
  _data: GeneNetwork = {} as GeneNetwork;
  get data(): GeneNetwork {
    return this._data;
  }
  @Input() set data(gene: GeneNetwork) {
    this._data = gene;
    this.init();
  }

  @Output() updategene: EventEmitter<RnaDifferentialExpression> =
    new EventEmitter<RnaDifferentialExpression>();
  @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef =
    {} as ElementRef;

  g: any;
  zoomHandler: any;
  linkElements: any;
  nodeElements: any;
  textElements: any;
  svg: any;
  pnode: any;
  loaded = false;
  pathways: GeneNode[] = [];
  width: any;
  height: any;
  simulation: any; //Simulation<SimulationNodeDatum, undefined>;
  hex = 'M18 2l6 10.5-6 10.5h-12l-6-10.5 6-10.5z';

  isInitialized = false;
  resizeTimer: ReturnType<typeof setTimeout> | number = 0;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {}

  init() {
    if (!this.data?.nodes?.length) {
      return;
    }

    if (this.isInitialized) {
      this.updateChart();
      return;
    }

    this.isInitialized = false;

    this.width =
      this.chartContainer.nativeElement.parentElement.offsetWidth - 30;
    this.height = 400 + 700 * (this.data.nodes.length / 100);
    this.loaded = true;
    this.simulation = d3
      .forceSimulation<GeneNode, GeneLink>()
      .force('charge', (d) => {
        let charge = -500;
        if (d === 0) {
          charge = 10 * charge;
        }
        return charge;
      })
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force(
        'collision',
        d3.forceCollide().radius(function () {
          return 35;
        })
      )
      .alphaDecay(0.5);
    this.renderChart();

    this.isInitialized = true;
  }

  ngAfterViewInit() {}

  // Resets the forceSimulation variables and hides the display
  removeSelf() {
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

  onResize() {
    const self = this;

    this.simulation
      .force('charge', (d: any) => {
        let charge = -500;
        if (d === 0) {
          charge = 10 * charge;
        }
        return charge;
      })
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force(
        'collision',
        d3.forceCollide().radius(function () {
          return 35;
        })
      )
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

    this.svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg:svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.g = this.svg.append('g').attr('class', 'everything');
    this.zoomHandler = d3
      .zoom()
      // Don't allow the zoomed area to be bigger than the viewport.
      .scaleExtent([1, 1])
      .translateExtent([
        [-200, -300],
        [this.width + 200, this.height + 300],
      ])
      .on('zoom', () => {
        // Zoom functions, this in this context is the svg
        //this.svg.select('g.everything').attr('transform', d3.event.transform);
      });
    this.zoomHandler(this.svg);
    this.svg.call(this.zoomHandler);

    this.linkElements = this.g
      .append('g')
      .attr('class', 'line')
      .selectAll('line')
      .data(this.data.links, (d: any) => d.source.id + '-' + d.target.id)
      .enter()
      .append('line')
      .attr('stroke-width', 2)
      .attr('stroke', this.getLinkColor);

    this.nodeElements = this.g
      .append('g')
      .selectAll('.node')
      .data(this.data.nodes, (d: any) => d.id)
      .enter()
      .append('path')
      .attr('class', 'node')
      .attr('transform', 'translate(0, 0)')
      .attr(
        'd',
        d3
          .symbol()
          .size(function (d) {
            return self.data.origin.ensembl_gene_id === d.ensembl_gene_id
              ? 300
              : 100;
          })
          .type(function (d) {
            return self.data.origin.ensembl_gene_id === d.ensembl_gene_id
              ? hexagonSymbol
              : d3.symbolCircle;
          })
      )
      .attr(
        'origin',
        (d: any) => this.data.origin.ensembl_gene_id === d.ensembl_gene_id
      )
      .attr('r', (d: any) => {
        return this.data.origin.ensembl_gene_id === d.ensembl_gene_id ? 38 : 17;
      })
      .attr('fill', this.getNodeColor)
      .on('click', (event: any, data: any) => {
        const index = Array.prototype.indexOf.call(
          event.target.parentElement.children,
          event.target
        );

        const nodes: any = this._data.nodes.filter(
          (node) => (node.id = data.id)
        ) as [];

        const first = event.target
          .closest('svg')
          .querySelector('.node:first-child');

        if (first) {
          d3.select(first).attr('fill', '#F47E6C');
          first.classList.remove('selected');
        }

        if (this.pnode) {
          const selected = event.target
            .closest('svg')
            .querySelector('.node.selected');

          if (selected) {
            d3.select(selected).attr(
              'fill',
              this.getNodeColor(this.pnode.node, this.pnode.index, [])
            );
            selected.classList.remove('selected');
          }
        } else {
          for (let j = 0; j < nodes.length; j++) {
            const el: any = d3.select(nodes[j]);
            if (
              data &&
              this._data.origin.ensembl_gene_id ===
                el._groups[0].ensembl_gene_id
            ) {
              el.attr('fill', this.getNodeColor(data[0], j, []));
              break;
            }
          }
        }
        this.pnode = { index: index, node: data };
        d3.select(event.target).attr('fill', '#FCCB6F');
        event.target.classList.add('selected');
        this.buildPath(data);
      })
      .on('mouseover', function (this: any) {
        d3.select(this).attr(
          'd',
          d3
            .symbol()
            .size(function (d) {
              return self.data.origin.ensembl_gene_id === d.ensembl_gene_id
                ? 300
                : 200;
            })
            .type(function (d) {
              return self.data.origin.ensembl_gene_id === d.ensembl_gene_id
                ? hexagonSymbol
                : d3.symbolCircle;
            })
        );
      })
      .on('mouseout', function (this: any) {
        d3.select(this).attr(
          'd',
          d3
            .symbol()
            .size(function (d) {
              return self.data.origin.ensembl_gene_id === d.ensembl_gene_id
                ? 300
                : 100;
            })
            .type(function (d) {
              return self.data.origin.ensembl_gene_id === d.ensembl_gene_id
                ? hexagonSymbol
                : d3.symbolCircle;
            })
        );
      });

    this.g.select('.node:first-child').node().classList.add('selected');

    this.textElements = this.g
      .append('g')
      .attr('class', 'text')
      .selectAll('text')
      .data(this.data.nodes, (d: any) => d.id)
      .enter()
      .append('text')
      .text((node: any) => node.hgnc_symbol || node.ensembl_gene_id)
      .attr('font-size', 12)
      .attr('dx', 13)
      .attr('dy', 4);

    this.simulation.nodes(this.data.nodes).on('tick', () => {
      this.nodeElements
        .attr(
          'cx',
          (node: any) =>
            (node.x = Math.max(24, Math.min(this.width - 24, node.x)))
        )
        .attr(
          'cy',
          (node: any) =>
            (node.y = Math.max(24, Math.min(this.height - 24, node.y)))
        )
        .attr(
          'transform',
          (d: any) => 'translate(' + d.x + ',' + d.y + ') scale(1.75)'
        );

      this.textElements
        .attr('x', (node: any) => node.x)
        .attr('y', (node: any) => node.y)
        .attr('dx', (node: any) => {
          // A font size of 12 has 16 pixels per letter, so we pick
          // half the word and make a negative dx. The anchor is in
          // the middle so we half the result again
          return (
            (-(node.hgnc_symbol?.length || node.ensembl_gene_id?.length) * 16) /
            2 /
            2
          );
        })
        .attr('dy', () => {
          return 35;
        });

      this.linkElements
        .attr('x1', (link: any) => link.source.x)
        .attr('y1', (link: any) => link.source.y)
        .attr('x2', (link: any) => link.target.x)
        .attr('y2', (link: any) => link.target.y);
    });

    this.simulation.force(
      'link',
      d3
        .forceLink(this.data.links)
        .links(this.data.links)
        .id((d: any /*SimulationNodeDatum*/) => d['id'])
        .strength((d) => {
          return d.value / 100.0;
        })
    );
  }

  updateChart() {
    const self = this;
    if (!this.loaded) {
      return;
    }
    if (this.pnode) {
      d3.select(this.nodeElements.nodes()[this.pnode.index]).attr(
        'fill',
        this.getNodeColor(this.pnode.node, this.pnode.index, [])
      );
      this.pnode = null;
    }
    // linkElements
    this.linkElements = this.linkElements.data(
      this.data.links,
      (d: any) => d.source.id + '-' + d.target.id
    );
    this.linkElements.exit().remove();
    this.linkElements = this.linkElements
      .enter()
      .append('line')
      .attr('stroke-width', 2)
      .attr('stroke', this.getLinkColor)
      .merge(this.linkElements);

    // node elements
    this.nodeElements = this.nodeElements.data(
      this.data.nodes,
      (d: any) => d.id
    );
    this.nodeElements.exit().remove();
    this.nodeElements = this.nodeElements
      .enter()
      .append('path')
      .attr('class', (d: any) => {
        return self.data.origin.ensembl_gene_id === d.ensembl_gene_id
          ? 'hex'
          : 'node';
      })
      .attr('transform', 'translate(0, 0)')
      .attr('d', (d: any) => {
        if (self.data.origin.ensembl_gene_id !== d.ensembl_gene_id) {
          return d3
            .symbol()
            .size((dd) => {
              return self.data.origin.ensembl_gene_id === dd.ensembl_gene_id
                ? 300
                : 100;
            })
            .type((dd) => {
              return self.data.origin.ensembl_gene_id === dd.ensembl_gene_id
                ? hexagonSymbol
                : d3.symbolCircle;
            })(this);
        }
        return self.hex;
      })
      .attr('r', (d: any) => {
        return self.data.origin.ensembl_gene_id === d.ensembl_gene_id ? 38 : 17;
      })
      .attr('fill', this.getNodeColor)
      .on('click', (d: any, i: any, nodes: any) => {
        if (this.pnode) {
          d3.select(nodes[this.pnode.index]).attr(
            'fill',
            self.getNodeColor(this.pnode.node, this.pnode.index, [])
          );
        }
        this.pnode = { index: i, node: d };
        d3.select(nodes[i]).attr('fill', '#4F6FC3');
        this.buildPath(d);
      })
      .merge(this.nodeElements);

    // text elements
    this.textElements = this.textElements.data(
      this.data.nodes,
      (d: any) => d.id
    );
    this.textElements.exit().remove();
    this.textElements = this.textElements
      .enter()
      .append('text')
      .text((node: any) => node.hgnc_symbol || node.ensembl_gene_id)
      .attr('font-size', 12)
      .attr('dx', 23)
      .attr('dy', 4)
      .merge(this.textElements);

    this.simulation.nodes(this.data.nodes);
    this.simulation
      .force(/*<ForceLink<GeneNode, GeneLink>>*/ 'link')
      .links(this.data.links);
    this.simulation.alpha(1).restart();
  }

  getNodeColor(node: GeneNode, index: number, arr: any[]): string {
    if (!!arr.length && arr[index].getAttribute('origin') === 'true') {
      return '#FCCB6F';
    }
    if (
      this.data &&
      this.data.origin.ensembl_gene_id === node.ensembl_gene_id
    ) {
      return '#F47E6C';
    }
    if (node.brainregions.length >= 8) {
      return '#1C3A35';
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

  getLinkColor(link: GeneLink): string {
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

  buildPath(gene: RnaDifferentialExpression) {
    this.updategene.emit(gene);
  }
}
