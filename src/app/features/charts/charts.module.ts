import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import {
  BoxPlotComponent,
  CandlestickChartComponent,
  MedianChartComponent,
  RowChartComponent,
  ScoreChartComponent,
  ScoreBarChartComponent,
  BiodomainsChartComponent,
  NetworkChartComponent,
} from './components';

@NgModule({
  declarations: [
    BoxPlotComponent,
    CandlestickChartComponent,
    MedianChartComponent,
    RowChartComponent,
    ScoreChartComponent,
    ScoreBarChartComponent,
    BiodomainsChartComponent,
    NetworkChartComponent,
  ],
  imports: [CommonModule, SharedModule],
  exports: [
    BoxPlotComponent,
    CandlestickChartComponent,
    MedianChartComponent,
    RowChartComponent,
    ScoreChartComponent,
    ScoreBarChartComponent,
    BiodomainsChartComponent,
    NetworkChartComponent,
  ],
  providers: [],
})
export class ChartsModule {}
