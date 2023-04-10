import { Component } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'biodomains-chart',
  templateUrl: './biodomains-chart.component.html',
  styleUrls: ['./biodomains-chart.component.scss'],
})
export class BiodomainsChartComponent {
  selection = '';
  goTerms: any[] = [];

  constructor() {}
}
