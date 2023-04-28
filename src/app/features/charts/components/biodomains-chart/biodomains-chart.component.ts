import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { HelperService } from '../../../../core/services';
import { BioDomain } from 'app/models';
import * as d3 from 'd3';

@Component({
  selector: 'biodomains-chart',
  templateUrl: './biodomains-chart.component.html',
  styleUrls: ['./biodomains-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BiodomainsChartComponent implements OnInit {
  @Input() data: BioDomain[] | undefined;
  @Input() geneName = '';
  @Output() selectedBioDomainIndex = new EventEmitter<number>();

  selectedBioDomain = '';
  selectedIndex = 0;

  constructor(private helperService: HelperService) {}

  ngOnInit(): void {
    this.createChart();
  }

  createChart() {
    if (this.data) {
      this.selectedBioDomainIndex.emit(this.selectedIndex);

      if (this.selectedIndex > -1)
        this.selectedBioDomain = this.data[this.selectedIndex].biodomain;

      const svg = d3.select('#chart')
        .append('svg')
        .attr('width', 500)
        .attr('height', 560);

      const chartWidth = +svg.attr('width');
      const chartHeight = +svg.attr('height');

      const labelWidth = 200;

      const barColor = '#8B8AD1';
      
      const xScale = d3.scaleLinear()
        .domain([0, d3.max(this.data, d => d.pct_linking_terms) as number])
        .range([0, 200]);

      const yScale = d3.scaleBand()
        .domain(this.data.map(d => d.biodomain))
        .range([0, chartHeight])
        .paddingInner(0.4);

      // tooltip
      d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip arrow-below tooltip-arrow');

      // negative space above bar
      svg
        .append('g')
        .attr('id', 'negative-bars')
        .selectAll('rect')
        .data(this.data)
        .enter().append('rect')
        .attr('x', d => labelWidth + xScale(d.pct_linking_terms))
        .attr('y', d => yScale(d.biodomain) || 0)
        .attr('width', d => chartWidth - labelWidth - xScale(d.pct_linking_terms))
        .attr('height', yScale.bandwidth())
        .attr('fill', 'white')
        .on('click', (event) => {
          const index = d3.select('#negative-bars').selectAll('rect').nodes().indexOf(event.currentTarget);
          this.setStyles(index);
        })
        .on('mouseover', (event) => {
          const index = d3.select('#negative-bars').selectAll('rect').nodes().indexOf(event.currentTarget);
          d3.select('#bars').select(`rect:nth-child(${ index + 1 })`).style('fill-opacity', '100%');
          d3.select('#bar-label').select(`text:nth-child(${ index + 1 })`).style('font-weight', 'bold');
        })
        .on('mouseout', (event) => {
          const index = d3.select('#negative-bars').selectAll('rect').nodes().indexOf(event.currentTarget);
          // if the target is the selected index
          if (this.selectedIndex !== index) {
            d3.select('#bars').select(`rect:nth-child(${ index + 1 })`).style('fill-opacity', '50%');
            d3.select('#bar-label').select(`text:nth-child(${ index + 1 })`).style('font-weight', 'normal');
          }
        });

      // bar
      svg
        .append('g')
        .attr('id', 'bars')
        .selectAll('rect')
        .data(this.data)
        .enter().append('rect')
        .attr('x', labelWidth)
        .attr('y', d => yScale(d.biodomain) || 0)
        .attr('width', d => xScale(d.pct_linking_terms))
        .attr('height', yScale.bandwidth())
        .attr('fill', barColor)
        .style('fill-opacity', d => this.selectedBioDomain === d.biodomain ? '100%' : '50%')
        .on('click', (event) => {
          const index = d3.select('#bars').selectAll('rect').nodes().indexOf(event.currentTarget);
          this.setStyles(index);
        })
        .on('mouseover', (event) => {
          const index = d3.select('#bars').selectAll('rect').nodes().indexOf(event.currentTarget);
          d3.select('#bars').select(`rect:nth-child(${ index + 1 })`).style('fill-opacity', '100%');
          d3.select('#bar-label').select(`text:nth-child(${ index + 1 })`).style('font-weight', 'bold');
        })
        .on('mouseout', (event) => {
          const index = d3.select('#bars').selectAll('rect').nodes().indexOf(event.currentTarget);
          // if the target is the selected index
          if (this.selectedIndex !== index) {
            d3.select('#bars').select(`rect:nth-child(${ index + 1 })`).style('fill-opacity', '50%');
            d3.select('#bar-label').select(`text:nth-child(${ index + 1 })`).style('font-weight', 'normal');
          }
        });

      // bar label
      svg
        .append('g')
        .attr('id', 'bar-label')
        .selectAll('text')
        .data(this.data)
        .enter().append('text')
        .attr('x', labelWidth - 10)
        .attr('y', d => (yScale(d.biodomain) || 0) + yScale.bandwidth() / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .style('font-size', '12px')
        .style('font-weight', d => this.selectedBioDomain === d.biodomain ? 'bold' : 'normal')
        .text(d => d.biodomain)
        .on('click', (event) => {
          const index = d3.select('#bar-label').selectAll('text').nodes().indexOf(event.currentTarget);
          this.setStyles(index);
        })
        .on('mouseover', (event, data) => {
          const index = d3.select('#bar-label').selectAll('text').nodes().indexOf(event.currentTarget);
          d3.select('#bar-label').select(`text:nth-child(${ index + 1 })`).style('font-weight', 'bold');

          const tooltipText = this.getToolTipText(data.pct_linking_terms);
          d3.select('.tooltip')
            .text(tooltipText)
            .style('display', 'block');
        })
        .on('mousemove', (event) => {
          d3.select('.tooltip')
            .style('left', `${ event.pageX }px`)
            .style('top', `${ event.pageY }px`);
        })
        .on('mouseleave', (event) => {
          d3.select('.tooltip')
            .style('display', 'none');
          const index = d3.select('#bar-label').selectAll('text').nodes().indexOf(event.currentTarget);
          // if the target is the selected index
          if (this.selectedIndex !== index)
            d3.select('#bar-label').select(`text:nth-child(${ index + 1 })`).style('font-weight', 'normal');
        });

      // bar value
      svg
        .append('g')
        .attr('id', 'bar-value')
        .selectAll('text')
        .data(this.data)
        .enter().append('text')
        .attr('x', d => labelWidth + xScale(d.pct_linking_terms) + 4)
        .attr('y', d => (yScale(d.biodomain) || 0) + yScale.bandwidth() / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'start')
        .style('font-size', '12px')
        .text(data => {
          let percentage = this.helperService.roundNumber(data.pct_linking_terms, 1);
          if (percentage === '0.0')
            percentage = '0';
          return `${ percentage }%`;
        })
        .style('display', (d) => this.selectedBioDomain === d.biodomain ? 'block' : 'none' );
    }
  }

  getToolTipText(linkingTerms: number) {
    if (linkingTerms === 0)
      return `No GO Terms link this biological domain to ${this.geneName}`;
    return `Click to explore to GO Terms that link this biological domain to ${this.geneName}`;
  }

  setStyles(index: number) {
    this.selectedIndex = index;
    // emit change to index to populate GO terms
    this.selectedBioDomainIndex.emit(index);
    // reset all elements to non-bold
    d3.select('#bar-label').selectAll('text').style('font-weight', 'normal');
    d3.select('#bars').selectAll('rect').style('fill-opacity', '50%');
    d3.select('#bar-value').selectAll('text').style('display', 'none');
    // bold the selected elements
    d3.select('#bar-label').select(`text:nth-child(${ index + 1 })`).style('font-weight', 'bold');
    d3.select('#bars').select(`rect:nth-child(${ index + 1 })`).style('fill-opacity', '100%');
    d3.select('#bar-value').select(`text:nth-child(${ index + 1 })`).style('display', 'block');
  }
}
